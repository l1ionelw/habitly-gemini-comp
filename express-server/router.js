const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require('./gemini-comp-f9cc5-firebase-adminsdk.json');
const {getAuth} = require("firebase-admin/auth");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = getFirestore();

function verifyIdToken(req, res, next) {
  if (!req.headers.authorization){
    return res.send("No auth provided");
  }
  getAuth()
      .verifyIdToken(req.headers.authorization)
      .then((decodedToken) => {
        console.log("working");
        req.body.uid = decodedToken.uid;
        next();
      })
      .catch((error) => {
        return res.send("Error: ", error.message);
      });
}

router.get('/', (req, res) => {
  res.send("EXPRESS API! YAYYYYYYYYY!");
});

router.post("/setData/", verifyIdToken, async (req, res) => {
  const uid = req.body.uid;
  const key = req.body.key;

  return res.send("meow");
})

module.exports = router;