const express = require('express');
const dotenv = require('dotenv').config()
const router = express.Router();
const admin = require('firebase-admin');
const {getFirestore} = require("firebase-admin/firestore");
const {getAuth} = require("firebase-admin/auth");
const getItemFromFirestore = require("../Utils/getItemFromFirestore");
const {DateTime} = require("luxon");
const updateItemInsideFirestore = require("../Utils/updateItemInFirestore");
const addItemIntoFirestore = require("../Utils/addItemIntoFirestore");
const logEntryAllowed = require("../Utils/logEntryAllowed");
const deleteItemFromFirestore = require("../Utils/deleteItemFromFirestore");

const OFFLINE_USER_UID = "gqug8hdPwn51XYJhOzI1lcLcgdXK"
console.log(process.env.MODE);
if (process.env.MODE === "production") {
    console.log("running in production");
    admin.initializeApp({
        credential: admin.credential.cert({
            "type": "service_account",
            "project_id": process.env.SERVICE_ACCOUNT_PROJECT_ID,
            "private_key_id": process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
            "private_key": process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
            "client_email": process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
            "client_id": process.env.SERVICE_ACCOUNT_CLIENT_ID,
            "auth_uri": process.env.SERVICE_ACCOUNT_AUTH_URI,
            "token_uri": process.env.SERVICE_ACCOUNT_TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.SERVICE_ACCOUNT_AUTH_PROVIDER,
            "client_x509_cert_url": process.env.SERVICE_ACCOUNT_CLIENT_CERT_URL,
            "universe_domain": "googleapis.com"
        }),
    });
}  else {
    console.log("NOT running in production")
    const serviceAccount = require('../gemini-comp-f9cc5-firebase-adminsdk.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = getFirestore();

const LOG_TITLE_MAX_CHARS = 45;
const LOG_CONTENT_MAX_CHARS = 700;

function verifyIdToken(req, res, next) {
    if (process.env.FIRESTORE_EMULATOR_HOST) {
        req.body.uid = OFFLINE_USER_UID;
        return next();
    }
    if (!req.headers.authorization) {
        return res.send("No auth provided");
    }
    getAuth()
        .verifyIdToken(req.headers.authorization)
        .then((decodedToken) => {
            req.body.uid = decodedToken.uid;
            req.body.auth = decodedToken;
            return next();
        })
        .catch((error) => {
            return res.send(404, "Error: ", error.message);
        });
}

router.get('/', (req, res) => {
    res.send("EXPRESS API! YAYYYYYYYYY!");
});

router.post("/habits/complete/", verifyIdToken, async (req, res, next) => {
    const uid = req.body.uid;
    const habitId = req.body.habitId;
    console.log(uid);
    console.log(habitId);


    let userTimeZone = await getItemFromFirestore(db, uid, "users");
    if (userTimeZone.status !== "Success") {
        return next({"message": "An error occurred while fetching user profile", "statusCode": 424});
    }
    userTimeZone = userTimeZone.data.timezone;
    console.log(userTimeZone);

    let habitRecords = await getItemFromFirestore(db, habitId, "habits");
    if (habitRecords.status !== "Success") {
        return res.send("An error occurred while fetching habits profile");
    }
    habitRecords = habitRecords.data.records;
    console.log(habitRecords);

    let currentTimeMillis = DateTime.now().ts;

    if (habitRecords.length === 0) {
        console.log("is empty, adding current time");
        habitRecords.unshift(currentTimeMillis);
        console.log(habitRecords);
        await updateItemInsideFirestore(db, "habits", habitId, {"records": habitRecords}).then(e => {
            console.log("Added successfully 0");
            console.log(e);
            return res.send({"status": "success", "data": habitRecords});
        });
    } else {
        console.log("already has previous time, validating operation");
        let lastCompletedTime = DateTime.fromMillis(habitRecords[0], {zone: userTimeZone}).startOf("day");
        let currentTime = DateTime.fromMillis(currentTimeMillis, {zone: userTimeZone}).startOf("day");
        const diff = currentTime.diff(lastCompletedTime, ["days"]).days
        if (diff >= 1) { // valid
            habitRecords.unshift(currentTimeMillis);
            await updateItemInsideFirestore(db, "habits", habitId, {"records": habitRecords}).then(e => {
                console.log("Added successfully 1");
                console.log(e);
                return res.send({"status": "success", "data": habitRecords});
            });
        } else { // invalid
            console.log("This operation is invalid");
            return next({"message": "This operation is invalid", "statusCode": 403});
        }
    }
})

router.post("/habits/incomplete/", verifyIdToken, async (req, res, next) => {
    const uid = req.body.uid;
    const habitId = req.body.habitId;
    console.log(habitId);
    let userTimeZone = await getItemFromFirestore(db, uid, "users");
    if (userTimeZone.status !== "Success") {
        return next({"message": "An error occurred while fetching user profile", "statusCode": 424});
    }
    userTimeZone = userTimeZone.data.timezone;
    console.log(userTimeZone);

    let habitRecords = await getItemFromFirestore(db, habitId, "habits");
    if (habitRecords.status !== "Success") {
        return next({"message": "An error occurred while fetching habits profile", "statusCode": 405});
    }
    console.log(habitRecords);
    habitRecords = habitRecords.data.records;
    console.log(habitRecords);

    if (habitRecords.length === 0) {
        console.log("size is 0, what?");
        return next({"message": "This operation is not permitted", "statusCode": 403});
    }

    const currentDay = DateTime.now().setZone(userTimeZone).startOf("days");
    const lastHabitCompletedDay = DateTime.fromMillis(habitRecords[0], {zone: userTimeZone}).startOf("days");
    console.log(currentDay);
    console.log(lastHabitCompletedDay);
    if (currentDay.equals(lastHabitCompletedDay)) {
        habitRecords.splice(0, 1);
        await updateItemInsideFirestore(db, "habits", habitId, {"records": habitRecords}).then(e => {
            console.log("Added successfully");
            console.log(e);
            return res.send({"status": "success", "data": habitRecords});
        });
    } else {
        console.log("didnt complete habit today so cant match date");
        return next({"message": "This operation is not permitted", "statusCode": 403});
    }
})

router.post("/logs/add/", verifyIdToken, async (req, res, next) => {
    const uid = req.body.uid;
    const title = req.body.title.trim();
    const content = req.body.content.trim();
    const habitId = req.body.habitId;

    // character count requirements
    if (title > LOG_TITLE_MAX_CHARS || content > LOG_CONTENT_MAX_CHARS) {
        return next({"message": "Character limits exceeded for log content or title.", "statusCode": 403})
    }

    // get user time zone
    let userTimeZone = await getItemFromFirestore(db, uid, "users");
    if (userTimeZone.status !== "Success") {
        return next({"message": "An error occurred while fetching user profile", "statusCode": 424});
    }
    userTimeZone = userTimeZone.data.timezone;

    // get habit document and verify ownership
    let habitDoc = await getItemFromFirestore(db, habitId, "habits");
    if (habitDoc.status !== "Success") {
        return next({"message": "An error occurred while fetching habits profile", "statusCode": 424});
    }
    habitDoc = habitDoc.data;
    if (habitDoc.ownerId !== uid) {
        return next({"message": "This document does not exist, or is not yours", "statusCode": 403})
    }

    // check if log can be added today (if there is a previous log made today)
    let lastSubmittedLog;
    const logsRef = db.collection("logs");
    await logsRef.where("ownerId", "==", uid).where("habitOwner", "==", habitId).orderBy("createdAt", "desc").limit(1).get().then(querySnapshot => {
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            lastSubmittedLog = doc.data();
        })
    });

    console.log(lastSubmittedLog);

    // verify if operation is allowed today
    if (!logEntryAllowed(lastSubmittedLog, userTimeZone, habitDoc.records)) {
        return next({"message": "This operation is not permitted", "statusCode": 403});
    }

    const data = {
        "title": title,
        "content": content,
        "ownerId": uid,
        "habitOwner": habitId,
        "createdAt": admin.firestore.FieldValue.serverTimestamp()
    }
    // add to doc with the content
    await addItemIntoFirestore(db, "logs", data).then(resp => {
        data.id = resp.data;
        data.createdAt = {"seconds": DateTime.now().toSeconds()}
        return res.send(data)
    })
})

router.post("/logs/update/", verifyIdToken, async (req, res, next) => {
    const uid = req.body.uid;
    const logId = req.body.logId;
    const new_title = req.body.title ? req.body.title : "";
    const new_content = req.body.content ? req.body.content : "";
    const habitOwner = req.body.habitId;

    // character count requirements
    if (new_title.length > LOG_TITLE_MAX_CHARS || new_content.length > LOG_CONTENT_MAX_CHARS || new_title.length === 0) {
        return next({"message": "Character limits exceeded for log content or title.", "statusCode": 403})
    }
    // get most recent log
    console.log("getting recent log");
    let lastSubmittedLog;
    // TODO: also query by habit id
    const logsRef = db.collection("logs");
    await logsRef.where("ownerId", "==", uid).where("habitOwner", "==", habitOwner).orderBy("createdAt", "desc").limit(1).get().then(querySnapshot => {
        querySnapshot.forEach((doc) => {
            lastSubmittedLog = doc.data();
            lastSubmittedLog.id = doc.id;
        })
    });
    if (!lastSubmittedLog) {
        return next({"message": "This log doesn't exist", "statusCode": 403})
    }
    // check if log.id matches logId
    if (lastSubmittedLog.id !== logId) {
        return next({"message": "This document does not exist, or is not yours", "statusCode": 403})
    }
    console.log(lastSubmittedLog);
    // update log contents with new contents
    const data = {
        "title": new_title.trim(), "content": new_content.trim()
    }
    console.log(data);
    await updateItemInsideFirestore(db, "logs", logId, data).then((resp) => {
        return res.send({"status": "Success", "message": "Successfully done"})
    })
})


router.post("/logs/delete/", verifyIdToken, async (req, res, next) => {
    const uid = req.body.uid;
    const habitOwner = req.body.habitId;
    console.log("Deleting log");
    console.log(uid);
    console.log(habitOwner);

    let userTimeZone = await getItemFromFirestore(db, uid, "users");
    if (userTimeZone.status !== "Success") {
        return next({"message": "An error occurred while fetching user profile", "statusCode": 424});
    }
    userTimeZone = userTimeZone.data.timezone;
    console.log(userTimeZone);

    let lastSubmittedLog;
    const logsRef = db.collection("logs");
    await logsRef.where("ownerId", "==", uid).where("habitOwner", "==", habitOwner).orderBy("createdAt", "desc").limit(1).get().then(querySnapshot => {
        querySnapshot.forEach((doc) => {
            lastSubmittedLog = doc.data();
            lastSubmittedLog.id = doc.id;
        })
    });
    console.log(lastSubmittedLog);
    if (!lastSubmittedLog) {
        return next({"message": "This log doesn't exist", "statusCode": 403})
    }

    const currentDay = DateTime.now().setZone(userTimeZone).startOf("day");
    const logCreatedDay = DateTime.fromSeconds(lastSubmittedLog.createdAt.seconds, {zone: userTimeZone}).startOf("day");
    console.log(currentDay);
    console.log(logCreatedDay);

    if (logCreatedDay.equals(currentDay)) {
        console.log("can be deleted");
        let response;
        await deleteItemFromFirestore(db, "logs", lastSubmittedLog.id).then(e => {
            response = e;
        });
        console.log(response);
        if (response.status === "Success") {
            return res.send({"status": "Success", "message": "Deleted Successfully"});
        }
        return next({"message": "An error occurred while trying to delete the document"});
    }
    console.log("cant be deleted");
    return next({"message": "This operation is invalid", "statusCode": 403});
})

router.post("/dailylogs/add/", verifyIdToken, async (req, res, next) => {
    let title = req.body.title;
    let content = req.body.content;
    let uid = req.body.uid;
    title = title.trim();
    content = content.trim();
    // todo: check if title and content meet max character limit
    // todo: for ALL queries, check if the query is undefined (first ever query).

    // get user time zone
    let userTimeZone = await getItemFromFirestore(db, uid, "users");
    if (userTimeZone.status !== "Success") {
        return next({"message": "An error occurred while fetching user profile", "statusCode": 424});
    }
    userTimeZone = userTimeZone.data.timezone;
    console.log(userTimeZone);

    // get last added daily log
    let lastSubmittedLog;
    const logsRef = db.collection("dailylogs");
    await logsRef.where("ownerId", "==", uid).orderBy("createdAt", "desc").limit(1).get().then(querySnapshot => {
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            lastSubmittedLog = doc.data();
        })
    });
    if (!lastSubmittedLog) { // users' first ever log
        lastSubmittedLog = {createdAt: {seconds: DateTime.now().minus({hours: 48}).toSeconds()}}
    }

    const currentDate = DateTime.now().setZone(userTimeZone).startOf("day");
    const lastLogDate = DateTime.fromSeconds(lastSubmittedLog.createdAt.seconds, {zone: userTimeZone}).startOf("day");

    if (currentDate.diff(lastLogDate) >= 1) {
        let data = {
            "title": title,
            "content": content,
            "ownerId": uid,
            "createdAt": admin.firestore.FieldValue.serverTimestamp()
        }
        await addItemIntoFirestore(db, "dailylogs", data).then(resp => {
            data.id = resp.data;
            data.createdAt = {"seconds": DateTime.now().toSeconds()}
        })
        return res.send(data);
    }
    return next({"message": "This operation is invalid", "statusCode": 403});
})

router.post("/dailylogs/delete/", verifyIdToken, async (req, res, next) => {
    console.log("delete daily log");
    const uid = req.body.uid;
    const logId = req.body.logId;
    console.log(logId);
    let userTimeZone = await getItemFromFirestore(db, uid, "users");
    if (userTimeZone.status !== "Success") {
        return next({"message": "An error occurred while fetching user profile", "statusCode": 424});
    }
    userTimeZone = userTimeZone.data.timezone;
    console.log(userTimeZone);

    let thisLogToDelete;
    const logsRef = db.collection("dailylogs").doc(logId);
    await logsRef.get().then((doc) => {
        if (doc.exists) {
            thisLogToDelete = doc.data();
            thisLogToDelete.id = doc.id;
        } else {
            return next({"message": "This log doesn't exist", "statusCode": 403})
        }
    }).catch((err) => {
        return next({"message": err.message, "statusCode": 404})
    })

    if (thisLogToDelete.ownerId !== uid) {
        return next({"message": "You are not authorized to modify this log", "statusCode": 403})
    }

    const currentDay = DateTime.now().setZone(userTimeZone).startOf("day");
    const logCreatedDay = DateTime.fromSeconds(thisLogToDelete.createdAt.seconds, {zone: userTimeZone}).startOf("day");

    if (logCreatedDay.equals(currentDay)) {
        console.log("can be deleted");
        let response;
        await deleteItemFromFirestore(db, "dailylogs", logId).then(e => {
            response = e;
        });
        console.log(response);
        if (response.status === "Success") {
            return res.send({"status": "Success", "message": "Deleted Successfully"});
        }
        return next({"message": "An error occurred while trying to delete the document"});
    }
    console.log("cant be deleted");
    return next({"message": "This operation is invalid", "statusCode": 403});
})

router.post("/dailylogs/update/", verifyIdToken, async (req, res, next) => {
    const logId = req.body.logId;
    const new_title = req.body.title ? req.body.title : "";
    const new_content = req.body.content ? req.body.content : "";
    const uid = req.body.uid

    let userTimeZone = await getItemFromFirestore(db, uid, "users");
    if (userTimeZone.status !== "Success") {
        return next({"message": "An error occurred while fetching user profile", "statusCode": 424});
    }
    userTimeZone = userTimeZone.data.timezone;
    console.log(userTimeZone);

    let lastSubmittedLog;
    const logsRef = db.collection("dailylogs").doc(logId);
    await logsRef.get().then((doc) => {
        if (doc.exists) {
            lastSubmittedLog = doc.data();
            lastSubmittedLog.id = doc.id;
        } else {
            return next({"message": "This log doesn't exist", "statusCode": 403})
        }
    }).catch((err) => {
        return next({"message": err.message, "statusCode": 404})
    })

    if (lastSubmittedLog.ownerId !== uid) {
        return next({"message": "You are not authorized to modify this log", "statusCode": 403})
    }


    const currentDay = DateTime.now().setZone(userTimeZone).startOf("day");
    const logCreatedDay = DateTime.fromSeconds(lastSubmittedLog.createdAt.seconds, {zone: userTimeZone}).startOf("day");

    if (logCreatedDay.equals(currentDay)) {
        const data = {
            "title": new_title.trim(), "content": new_content.trim()
        }
        console.log(data);
        await updateItemInsideFirestore(db, "dailylogs", logId, data).then((resp) => {
            return res.send({"status": "Success", "message": "Successfully done"})
        }).catch(e => {
            return next({"message": e.message});
        })
    } else {
        console.log("cant be modified");
        return next({"message": "This operation is invalid", "statusCode": 403});
    }
})

router.post("/habit/delete/", verifyIdToken, async (req, res, next) => {
    let uid = req.body.uid;
    let habitId = req.body.habitId;
    let habitDoc;
    const habitRef = db.collection("habits").doc(habitId);
    await habitRef.get().then((doc) => {
        if (!doc.exists) return next({"message": "This document does not exist", "statusCode": 404})
        habitDoc = doc.data();
        habitDoc.id = doc.id;
    })
    if (habitDoc.ownerId !== uid) return next({
        "message": "You are not authorized to modify this document",
        "statusCode": 403
    })

    await deleteItemFromFirestore(db, "habits", habitId);

    const habitLogsQuery = db.collection("logs").where("habitOwner", "==", habitId);
    await habitLogsQuery.get().then((querySnapshot) => {
        const promises = [];
        querySnapshot.forEach((logItem) => {
            promises.push(logItem.ref.delete());
        })
        Promise.all(promises);
    })
    return res.send({"message": "Successfully deleted habit and corresponding logs"})
})

module.exports = router;