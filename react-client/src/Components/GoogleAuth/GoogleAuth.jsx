import {GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase.js";
import {getDoc, serverTimestamp} from "firebase/firestore";
import getItemFromFirestore from "../../Utils/getItemFromFirestore.js";
import setItemIntoFirestore from "../../Utils/setItemIntoFirestore.js";

export default async function handleGoogle(arg) {
    if (arg === "Demo") {
        console.log("logging in with demo account");
        const auth = getAuth();
        signInWithEmailAndPassword(auth, "demo@habitlyteam.com", "demohabitly")
            .then(async (userCredential) => {
                console.log("demo account logged in")
                const user = userCredential.user;
                console.log(user);
                console.log("user doesn't exist");
                user.displayName = "demo"
                // await setItemIntoFirestore("users", user.uid, getData(user))
                window.location.href = "/";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
        return;
    }
    const provider = await new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            const uid = user.uid;
            const userData = await getItemFromFirestore(uid, "users");
            if (userData.status === "Error") {
                console.log("user doesn't exist");
                await setItemIntoFirestore("users", uid, getData(user))
            }
            console.log("redirecting");
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