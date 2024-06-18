import {useContext, useState} from "react";
import setItemIntoFirestore from "../../Utils/setItemIntoFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {db} from "../../firebase.js";
import getItemFromFirestore from "../../Utils/getItemFromFirestore.js";
import addItemIntoFirestore from "../../Utils/addItemIntoFirestore.js";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import checkHabitExists from "./Utils/checkHabitExists.js";

export default function AddHabit() {
    const [value, setValue] = useState("");
    const [missionStatement, setMissionStatement] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const userId = useContext(Auth).user.uid;

    async function onSubmit(e) {
        // TODO: add character limit to fields
        e.preventDefault();
        setErrorMessage("");
        const valueTrimmed = value.trim();
        const statementTrimmed = missionStatement.trim();
        const data = {
            title: valueTrimmed,
            missionStatement: statementTrimmed,
            ownerId: userId,
            records: [],
            createdAt: serverTimestamp()
        }
        // TODO: Don't re-query, build context for habits list to share data
        const currentHabits = await queryItemFromFirestore("habits", "ownerId", userId);
        if (!checkHabitExists(currentHabits, valueTrimmed)) {
            await addItemIntoFirestore(userId, "habits", data);
            setValue("");
            setMissionStatement("");
            setErrorMessage("Operation successful!");
        } else {
            console.log("This habit already exists");
            setErrorMessage("This habit already exists");
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
            <div hidden={errorMessage === ""}>{errorMessage}</div>
        </div>
    )
}