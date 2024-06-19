// delete item from firestore given the collection name and document id
import {doc, deleteDoc} from "firebase/firestore";
import {db} from "../firebase.js";

export default async function deleteItemFromFirestore(collectionName, documentId) {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
}