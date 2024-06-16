import {doc, setDoc} from "firebase/firestore";
import {db} from "../firebase.js";

export default async function setItemIntoFirestore(key, uid, data, opts) {
    const docItem = doc(db, key, uid);
    await setDoc(docItem, data, opts);
}