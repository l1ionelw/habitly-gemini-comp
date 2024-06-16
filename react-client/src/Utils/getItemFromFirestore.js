import {db} from "../firebase.js";
import {doc, getDoc} from "firebase/firestore";

export default async function getItemFromFirestore(uid, collectionName) {
    const docRef = doc(db, collectionName, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap;
    } else {
        console.log("Can't find document");
        return null;
    }
}