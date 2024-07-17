import {useContext, useMemo, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import getItemFromFirestore from "../../Utils/getItemFromFirestore.js";
import HabitsList from "./HabitsList.jsx";
import Button from "../UI/Button.jsx";
import ContentBlurred from "../UI/ContentBlurred.jsx";
import {AppContext} from "../Contexts/AppContext.jsx";
import {produce} from "immer";
import EditorPopup from "../UI/EditorPopup.jsx";
import {serverTimestamp} from "firebase/firestore";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import checkHabitExists from "./Utils/checkHabitExists.jsx";
import addItemIntoFirestore from "../../Utils/addItemIntoFirestore.js";

export default function Habits() {
    const [userData, setUserData] = useState(null);
    const userId = useContext(Auth).user.uid;
    const setHabitsList = useContext(AppContext).setter;
    const [showEditor, setShowEditor] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const HABIT_TITLE_MAX_LENGTH = 45
    const HABIT_MISSIONSTATEMENT_MAX_LENGTH = 400;

    useMemo(() => {
        getItemFromFirestore(userId, "users").then(data => {
            setUserData(data.data);
        });
    }, [userId]);

    function addNewItemToState(data) {
        if (!data) return;
        setHabitsList(produce(draft => {
            draft.unshift(data);
        }))
        setShowEditor(false);
    }

    function validation(title, statement) {
        title = title.trim();
        statement = statement.trim();
        const rulesBroken = title.length > HABIT_TITLE_MAX_LENGTH || statement.length > HABIT_MISSIONSTATEMENT_MAX_LENGTH
        if (rulesBroken) {
            console.log("validaion not passed lmao");
            setErrorMessage("An error occurred: Habit fields exceed max length");
        }
        return !rulesBroken
    }

    async function addNewHabit(title, statement) {
        title = title.trim();
        statement = statement.trim();
        const data = {
            title: title,
            missionStatement: statement,
            ownerId: userId,
            records: [],
            createdAt: serverTimestamp()
        }
        const currentHabits = await queryItemFromFirestore("habits", "ownerId", userId);
        if (!checkHabitExists(currentHabits, title)) {
            const transaction = await addItemIntoFirestore("habits", data);
            data.id = transaction.data;
            transaction.status === "Success" ? addNewItemToState(data) : setErrorMessage("An Error Occurred: " + transaction.data);
        } else {
            setErrorMessage("An error occurred: This habit already exists");
        }

    }


    if (userData) {
        return (
            <div className={`pt-5`}>
                <ContentBlurred showEditor={showEditor}>
                    <Button text={"Add Habit"} size={15} onClick={() => setShowEditor(!showEditor)}/>
                    <div hidden={errorMessage === ""}>{errorMessage}</div>
                    <div className={"text-emerald-600"}>
                        <h1>{userData.name}</h1>
                        <h3>{userData.email}</h3>
                    </div>
                    <HabitsList/>
                </ContentBlurred>
                <EditorPopup header={"Create a new habit"} visible={showEditor} validation={validation} onCancel={() => setShowEditor(false)}
                             onSubmit={addNewHabit}/>
            </div>

        )
    }
    return <Loading/>
}