import { useContext, useState } from "react";
import { Auth } from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import HabitsList from "./HabitsList.jsx";
import Button from "../UI/Button.jsx";
import ContentBlurred from "../UI/ContentBlurred.jsx";
import { AppContext } from "../Contexts/AppContext.jsx";
import { produce } from "immer";
import EditorPopup from "../UI/EditorPopup.jsx";
import { serverTimestamp } from "firebase/firestore";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import checkHabitExists from "./Utils/checkHabitExists.jsx";
import addItemIntoFirestore from "../../Utils/addItemIntoFirestore.js";
import generateHabitTips from "../Ai/Utils/generateHabitTips.js";
import AiCard from "../UI/AiCard.jsx";

export default function Habits() {
    const userData = useContext(Auth).user;
    const userId = useContext(Auth).user.uid;
    const setHabitsList = useContext(AppContext).setter;
    const habitsList = useContext(AppContext).getter;
    const [showEditor, setShowEditor] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [aiMessage, setAiMessage] = useState("");
    const [aiGenerateState, setAiGenerateState] = useState("Unloaded"); // Idle, Loading, Error, Done

    const HABIT_TITLE_MAX_LENGTH = 45
    const HABIT_MISSIONSTATEMENT_MAX_LENGTH = 400;
    function addNewItemToState(data) {
        if (habitsList === "Error" || habitsList === "No Habits") {
            setHabitsList([]);
        }
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
            setAiGenerateState("Loading");
            generateHabitTips(title, statement).then((response) => { setAiMessage(response); setAiGenerateState("Done") }).catch((e) => { console.log(e.message); setAiGenerateState("Error") })
        } else {
            setErrorMessage("An error occurred: This habit already exists");
        }
    }

    if (userData) {
        return (
            <div className={`pt-5`}>
                <ContentBlurred showEditor={showEditor}>
                    <Button text={"New Habit"} size={15} onClick={() => setShowEditor(!showEditor)} variant={"primary"}/>
                    <div hidden={errorMessage === ""}>{errorMessage}</div>
                    {aiGenerateState !== "Unloaded" && <AiCard message={aiMessage} state={aiGenerateState} setState={setAiGenerateState} className={"mt-5"}/>}
                    <HabitsList />
                </ContentBlurred>
                {showEditor && <EditorPopup header={"Create a new habit"} visible={showEditor} validation={validation}
                    onCancel={() => setShowEditor(false)}
                    onSubmit={addNewHabit} />}
            </div>
        )
    }
    return <Loading />
}