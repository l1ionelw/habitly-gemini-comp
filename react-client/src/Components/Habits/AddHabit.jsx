import {useContext, useState} from "react";
import setItemIntoFirestore from "../../Utils/setItemIntoFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {db} from "../../firebase.js";
import getItemFromFirestore from "../../Utils/getItemFromFirestore.js";

export default function AddHabit() {
    const [value, setValue] = useState("");
    const [missionStatement, setMissionStatement] = useState("");
    const userId = useContext(Auth).user.uid;

    async function onSubmit(e) {
        // TODO: add character limit to fields
        e.preventDefault();
        const valueTrimmed = value.trim();
        const statementTrimmed = missionStatement.trim();
        const data = {
            [value]: {
                createdAt: serverTimestamp(),
                name: valueTrimmed,
                missionStatement: statementTrimmed,
                records: [],
            },
        }
        let checkExists = await getItemFromFirestore(userId, "habits");
        checkExists = checkExists._document.data.value.mapValue.fields[valueTrimmed]
        if (!checkExists) {
            console.log("data doesnt exist, adding");
            setItemIntoFirestore("habits", userId, data, {merge: true}).catch(e => console.log(e));
        } else {
            console.log("Error occurred, data already exists")
        }
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input placeholder={"title"} onChange={(e) => setValue(e.target.value)}/>
                <br/>
                <input placeholder={"mission statement"} onChange={(e) => setMissionStatement(e.target.value)}/>
                <br/>
                <input type={"submit"} value={"Add new habit"}/>
            </form>
        </div>
    )
}