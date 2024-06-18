import {db} from "../firebase.js";
import {doc, getDoc} from "firebase/firestore";

export default async function getItemFromFirestore(uid, collectionName) {
    const docRef = doc(db, collectionName, uid);
    const docSnap = await getDoc(docRef).catch(e => {
        console.log("Error fetching data");
        console.log(e.message);
    });
    if (docSnap && docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("Can't find document");
        return null;
    }
}