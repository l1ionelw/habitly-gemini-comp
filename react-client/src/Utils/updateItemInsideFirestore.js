import {doc, updateDoc} from "firebase/firestore";
import {db} from "../firebase.js";

export default async function updateItemInsideFirestore(collectionName, collectionId, updatedValues) {
    console.log("updating document");
    const updateRef = doc(db, collectionName, collectionId);
    await updateDoc(updateRef, updatedValues).catch(e=>{
        console.log("An error occurred while updating doc");
        console.log(e.message);
    });
}