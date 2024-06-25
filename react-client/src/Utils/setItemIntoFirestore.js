import {doc, setDoc} from "firebase/firestore";
import {db} from "../firebase.js";
import {API_URL} from "../main.jsx";
import getUserIdToken from "./getUserIdToken.js";

export default async function setItemIntoFirestore(key, uid, data, opts) {
    console.log("SETTING ITEM");
    let idToken = await getUserIdToken();
    console.log(idToken);
    if (idToken.status === "Error") {
        console.log(idToken.data);
        return "An error occurred";
    }
    await fetch(`${API_URL}/api/test/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": idToken.data
        },
        body: JSON.stringify({"key": key, "data": data, "opts": opts})
    })
    const docItem = doc(db, key, uid);
    await setDoc(docItem, data, opts);
}