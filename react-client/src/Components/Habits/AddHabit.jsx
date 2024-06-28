import {useContext, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import {serverTimestamp} from "firebase/firestore";
import addItemIntoFirestore from "../../Utils/addItemIntoFirestore.js";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import checkHabitExists from "./Utils/checkHabitExists.js";
import {produce} from "immer";
import {HabitsListContext} from "../Contexts/HabitsListContext.js";

export default function AddHabit() {
    const stateManager = useContext(HabitsListContext);
    const userId = useContext(Auth).user.uid;
    const [title, setTitle] = useState("");
    const [missionStatement, setMissionStatement] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const HABIT_TITLE_MAX_LENGTH = 45
    const HABIT_MISSIONSTATEMENT_MAX_LENGTH = 400;

    async function onSubmit(e) {
        e.preventDefault();
        setErrorMessage("");
        const titleTrimmed = title.trim();
        const statementTrimmed = missionStatement.trim();
        if (titleTrimmed > HABIT_TITLE_MAX_LENGTH || statementTrimmed > HABIT_MISSIONSTATEMENT_MAX_LENGTH) {
            setErrorMessage("An error occurred: Habit fields exceed max length");
        }
        const data = {
            title: titleTrimmed,
            missionStatement: statementTrimmed,
            ownerId: userId,
            records: [],
            createdAt: serverTimestamp()
        }
        const currentHabits = await queryItemFromFirestore("habits", "ownerId", userId);
        if (!checkHabitExists(currentHabits, titleTrimmed)) {
            const transaction = await addItemIntoFirestore("habits", data);
            transaction.status === "Success" ? handleAddSuccess(data, transaction.data) : setErrorMessage("An Error Occurred: " + transaction.data);
        } else {
            setErrorMessage("An error occurred: This habit already exists");
        }
    }

    function handleAddSuccess(data, docId) {
        setTitle("");
        setMissionStatement("");
        setErrorMessage("Operation successful!");
        data.id = docId;
        stateManager.setter(produce(draft => {
            draft.unshift(data);
        }))
    }


    return (
        <div>
            <h2>Add a habit</h2>
            <form onSubmit={onSubmit}>
                <input
                    placeholder={"title"}
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    maxLength={HABIT_TITLE_MAX_LENGTH}
                />
                <br/>
                <input placeholder={"mission statement"}
                       value={missionStatement}
                       onChange={(e) => setMissionStatement(e.target.value)}
                       maxLength={HABIT_MISSIONSTATEMENT_MAX_LENGTH}
                />
                <br/>
                <input type={"submit"} value={"Add new habit"}/>
            </form>
            <div hidden={errorMessage === ""}>{errorMessage}</div>
        </div>
    )
}