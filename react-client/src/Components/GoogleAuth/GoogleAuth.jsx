import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth, db} from "../../firebase.js";
import {doc, getDoc, setDoc, serverTimestamp} from "firebase/firestore";
import {DateTime} from "luxon";

export default async function handleGoogle() {
    const provider = await new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            const uid = user.uid;
            const docRef = doc(db, "users", uid);

            if (!await isUserInDatabase(docRef)) {
                await setUserInDatabase(user, docRef);
            }

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

async function setUserInDatabase(user, docRef) {
    const uid = user.uid;
    const email = user.email;
    const displayName = user.displayName;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userData = {
        createdAt: serverTimestamp(),
        email: email,
        name: displayName,
        timezone: timezone
    }

    console.log(uid);
    console.log(email);
    console.log(displayName);
    console.log(timezone);

    await setDoc(docRef, userData);
    console.log("Firebase timestamps added");
}

async function isUserInDatabase(docRef) {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return true;
    } else {
        return false;
    }
}