// returns data from the "Users" collection from firestore by user id. or null if uid is null.
// assumes user is already logged in with a valid uid. module is not responsible for checking auth
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase.js";

export default async function getUserData(uid) {
    if (!uid) {
        return null;
    }
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}