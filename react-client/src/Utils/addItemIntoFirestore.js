import {collection, addDoc} from "firebase/firestore";
import {db} from "../firebase.js";

export default async function addItemIntoFirestore(collectionName, data) {
    let status = "Loading";
    let response = "";

    const docToAdd = collection(db, collectionName);
    await addDoc(docToAdd, data).then(e => {
        console.log("data successfully added");
        status = "Success";
        response = e.id;
    }).catch(e => {
        console.log("An error occurred adding items");
        console.log(e.message);
        status = "Error";
        response = e.message;
    })

    return {"status": status, "data": response};

}
