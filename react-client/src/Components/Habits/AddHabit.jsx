import {useContext, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import {serverTimestamp} from "firebase/firestore";
import addItemIntoFirestore from "../../Utils/addItemIntoFirestore.js";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import checkHabitExists from "./Utils/checkHabitExists.js";
import {produce} from "immer";
import {HabitsListContext} from "../Contexts/HabitsListContext.js";

export default function AddHabit() {
    const [title, setTitle] = useState("");
    const [missionStatement, setMissionStatement] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const stateManager = useContext(HabitsListContext);
    const userId = useContext(Auth).user.uid;

    async function onSubmit(e) {
        // TODO: add character limit to fields
        e.preventDefault();
        setErrorMessage("");
        const titleTrimmed = title.trim();
        const statementTrimmed = missionStatement.trim();
        const data = {
            title: titleTrimmed,
            missionStatement: statementTrimmed,
            ownerId: userId,
            records: [],
            createdAt: serverTimestamp()
        }
        // TODO: Don't re-query, build context for habits list to share data
        // TODO: handle firestore errors
        const currentHabits = await queryItemFromFirestore("habits", "ownerId", userId);
        if (!checkHabitExists(currentHabits, titleTrimmed)) {
            const transaction = await addItemIntoFirestore("habits", data);
            transaction.status === "Success" ? handleAddSuccess(data, transaction.data) : handleAddError("An Error Occurred: " + transaction.data);
        } else {
            handleAddError("An error occurred: This habit already exists");
        }
    }

    function handleAddSuccess(data, docId) {
        setTitle("");
        setMissionStatement("");
        setErrorMessage("Operation successful!");
        data.id = docId;
        updateListState(data);
    }

    function handleAddError(errMessage) {
        console.log(errMessage);
        setErrorMessage(errMessage);
    }

    function updateListState(habitData) {
        stateManager.setter(produce(draft => {
            draft.unshift(habitData);
        }))
    }

    return (
        <div>
            <h2>Add a habit</h2>
            <form onSubmit={onSubmit}>
                <input placeholder={"title"} value={title} onChange={(e) => setTitle(e.target.value)}/>
                <br/>
                <input placeholder={"mission statement"} value={missionStatement}
                       onChange={(e) => setMissionStatement(e.target.value)}/>
                <br/>
                <input type={"submit"} value={"Add new habit"}/>
            </form>
            <div hidden={errorMessage === ""}>{errorMessage}</div>
        </div>
    )
}