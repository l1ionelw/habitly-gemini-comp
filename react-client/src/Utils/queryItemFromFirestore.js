import {collection, query, where, getDocs} from "firebase/firestore";
import {db} from "../firebase.js";

export default async function queryItemFromFirestore(collectionName, desiredKey, desiredValue) {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(desiredKey, "==", desiredValue));
    const querySnapshot = await getDocs(q).catch(e => {
        console.log("An error occurred while querying");
        console.log(e.message);
    });
    if (querySnapshot) {
        let dataReturnArray = [];
        querySnapshot.forEach((doc) => {
            dataReturnArray.push(doc.data());
        })
        return dataReturnArray;
    } else {
        return null;
    }
}