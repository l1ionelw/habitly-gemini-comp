import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth, db} from "../../firebase.js";
import {doc, getDoc, serverTimestamp} from "firebase/firestore";
import getItemFromFirestore from "../../Utils/getItemFromFirestore.js";
import setItemIntoFirestore from "../../Utils/setItemIntoFirestore.js";

export default async function handleGoogle() {
    const provider = await new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            const uid = user.uid;
            const userData = await getItemFromFirestore(uid, "users");
            if (!userData) {
                console.log("user doesn't exist");
                await setItemIntoFirestore("users", uid, getData(user))
            }
            console.log("redirectinh");
            window.location.href = "/";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("An error occurred");
            console.log(errorCode);
            console.log(errorMessage);
        });
}

function getData(user) {
    const uid = user.uid;
    const email = user.email;
    const displayName = user.displayName;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return {
        createdAt: serverTimestamp(),
        email: email,
        name: displayName,
        timezone: timezone
    };
}

async function isUserInDatabase(docRef) {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return true;
    } else {
        return false;
    }
}