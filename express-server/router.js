const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const {getFirestore} = require("firebase-admin/firestore");

const serviceAccount = require('./gemini-comp-f9cc5-firebase-adminsdk.json');
const {getAuth} = require("firebase-admin/auth");
const getItemFromFirestore = require("./Utils/getItemFromFirestore");
const {DateTime} = require("luxon");
const updateItemInsideFirestore = require("./Utils/updateItemInFirestore");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = getFirestore();

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

router.post("/completehabit/", verifyIdToken, async (req, res, next) => {
    const uid = req.body.uid;
    const habitId = req.body.habitId;
    console.log(uid);
    console.log(habitId);

    let userTimeZone = await getItemFromFirestore(db, uid, "users");
    if (userTimeZone.status !== "Success") {
        return res.send("An error occurred while fetching user profile");
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
            return res.send({"completedTime": currentTimeMillis});
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
                return res.send({"completedTime": currentTimeMillis});
            });
        } else { // invalid
            console.log("This operation is invalid");
            return next({"message": "This operation is invalid", "statusCode": 405});
        }
    }
})

router.post("/incomplete/", verifyIdToken, async (req, res, next) => {
    const uid = req.body.uid;
    const habitId = req.body.habitId;
    console.log(habitId);
    let userTimeZone = await getItemFromFirestore(db, uid, "users");
    if (userTimeZone.status !== "Success") {
        return res.send("An error occurred while fetching user profile");
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
        return next({"message": "This operation is not permitted", "statusCode": 405});
    }

    const currentDay = DateTime.now().setZone(userTimeZone).startOf("days");
    const lastHabitCompletedDay = DateTime.fromMillis(habitRecords[0], {zone: userTimeZone}).startOf("days");
    console.log(currentDay);
    console.log(lastHabitCompletedDay);
    if (currentDay.equals(lastHabitCompletedDay) < 1) {
        habitRecords.splice(0, 1);
        await updateItemInsideFirestore(db, "habits", habitId, {"records": habitRecords}).then(e => {
            console.log("Added successfully");
            console.log(e);
            return res.send({"status": "success", "data": habitRecords});
        });
    } else {
        console.log("didnt complete habit today so cant match date");
        return next({"message": "This operation is not permitted", "statusCode": 405});
    }


})


module.exports = router;