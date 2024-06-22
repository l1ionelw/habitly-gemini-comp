import {db} from "../firebase.js";
import {doc, getDoc} from "firebase/firestore";

export default async function getItemFromFirestore(itemId, collectionName) {
    let status = "Loading";
    let data;
    let error;

    const docRef = doc(db, collectionName, itemId);
    const docSnap = await getDoc(docRef).catch(e => {
        console.log("Error fetching data");
        console.log(e.message);
        status = "Error";
        error = `An error occurred while getting data: ${e.message}`;
    });
    if (docSnap && docSnap.exists()) {
        data = docSnap.data();
        status = "Success";
    } else {
        console.log("Can't find document");
        status = "Error";
        error = "An error occurred while getting data: Can't find document";
    }

    return {"status": status, "data": status === "Success" ? data : error};
}