import {useContext, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import {serverTimestamp} from "firebase/firestore";
import addItemIntoFirestore from "../../Utils/addItemIntoFirestore.js";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import checkHabitExists from "./Utils/checkHabitExists.jsx";
import Card from "../UI/Card.jsx";
import Button from "../UI/Button.jsx";

export default function NewItemCard({showEditor, setErrorMessage, callback}) {
    const userId = useContext(Auth).user.uid;
    const [title, setTitle] = useState("");
    const [missionStatement, setMissionStatement] = useState("");
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
        data.id = docId;
        callback(data);
    }


    return (
        <div hidden={!showEditor} className={"centered-xy"}
             style={{backgroundColor: "lightblue", padding: "1rem 0.5rem", borderRadius: "0.2rem"}}>
            <Card>
                <h3>Add a habit</h3>
                <form onSubmit={onSubmit}>
                    <div className={'flex flex-col gap-y-1'}>
                        <input
                            placeholder={"title"}
                            value={title} onChange={(e) => setTitle(e.target.value)}
                            maxLength={HABIT_TITLE_MAX_LENGTH}
                            className={"styled-input"}
                        />
                        <textarea placeholder={"mission statement"}
                                  value={missionStatement}
                                  onChange={(e) => setMissionStatement(e.target.value)}
                                  maxLength={HABIT_MISSIONSTATEMENT_MAX_LENGTH}
                                  className={"styled-textarea"}
                        />
                    </div>
                    <br/>
                    <div className={"flex"}>
                        <Button text={"Cancel"} size={15} onClick={callback} className={"ml-8"}/>
                        <div className={"flex-spacer"}></div>
                        <Button text={"Add"} size={15} onClick={onSubmit} className={"mr-8"}/>
                    </div>
                </form>
            </Card>
        </div>
    )
}