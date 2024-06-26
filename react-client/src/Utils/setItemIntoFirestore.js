import {doc, setDoc} from "firebase/firestore";
import {db} from "../firebase.js";
import {API_URL} from "../main.jsx";
import getUserIdToken from "./backend/getUserIdToken.js";

export default async function setItemIntoFirestore(key, uid, data, opts) {
    const docItem = doc(db, key, uid);
    await setDoc(docItem, data, opts);
}