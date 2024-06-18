import {collection, addDoc} from "firebase/firestore";
import {db} from "../firebase.js";

export default async function addItemIntoFirestore(uid, collectionName, data) {
    const docToAdd = collection(db, "habits");
    await addDoc(docToAdd, data).catch(e => {
        console.log("An error occurred adding items");
        console.log(e.message);
    })
}
