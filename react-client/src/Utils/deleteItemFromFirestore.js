import {doc, deleteDoc} from "firebase/firestore";
import {db} from "../firebase.js";

export default async function deleteDataFromFirestore(collectionName, idName) {
    const docRef = doc(db, collectionName, idName);
    await deleteDoc(docRef).catch(e=> {
        console.log("An error occurred while trying to delete a document");
        console.log(e.message);
    });
}