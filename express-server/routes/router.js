const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const {getFirestore, serverTimestamp} = require("firebase-admin/firestore");
const serviceAccount = require('../gemini-comp-f9cc5-firebase-adminsdk.json');
const {getAuth} = require("firebase-admin/auth");
const getItemFromFirestore = require("../Utils/getItemFromFirestore");
const {DateTime} = require("luxon");
const updateItemInsideFirestore = require("../Utils/updateItemInFirestore");
const addItemIntoFirestore = require("../Utils/addItemIntoFirestore");
const logEntryAllowed = require("../Utils/logEntryAllowed");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = getFirestore();
const LOG_TITLE_MAX_CHARS = 45;
const LOG_CONTENT_MAX_CHARS = 700;

function verifyIdToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.send("No auth provided");
    }
    getAuth()
        .verifyIdToken(req.headers.authorization)
        .then((decodedToken) => {
            req.body.uid = decodedToken.uid;
            req.body.auth = decodedToken;
            next();
        })
        .catch((error) => {
            return res.send("Error: ", error.message);
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
            console.log("Added successfully");
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
                console.log("Added successfully");
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
    await logsRef.where("ownerId", "==", uid).orderBy("createdAt", "desc").limit(1).get().then(querySnapshot => {
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
    const new_title = req.body.title.trim();
    const new_content = req.body.content.trim();
    // character count requirements
    if (new_title > LOG_TITLE_MAX_CHARS || new_content > LOG_CONTENT_MAX_CHARS) {
        return next({"message": "Character limits exceeded for log content or title.", "statusCode": 403})
    }
    // get most recent log
    let lastSubmittedLog;
    const logsRef = db.collection("logs");
    await logsRef.where("ownerId", "==", uid).orderBy("createdAt", "desc").limit(1).get().then(querySnapshot => {
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
    // update log contents with new contents
    const data = {
        "title": new_title,
        "content": new_content
    }
    await updateItemInsideFirestore(db, "logs", logId, data).then(e=>{
        return res.send({"status": "Success", "message": "Succesfully done"})
    })
})

module.exports = router;