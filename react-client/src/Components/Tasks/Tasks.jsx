import React, {useContext, useState} from 'react';
import TasksList from "./TasksList.jsx";
import Button from "../UI/Button.jsx";
import ContentBlurred from "../UI/ContentBlurred.jsx";
import {AppContext} from "../Contexts/AppContext.jsx";
import EditorPopup from "../UI/EditorPopup.jsx";
import {serverTimestamp} from "firebase/firestore";
import addItemIntoFirestore from "../../Utils/addItemIntoFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import {produce} from "immer";

export default function Tasks() {
    const userId = useContext(Auth).user.uid;
    const tasks = useContext(AppContext).getter;
    const setTasks = useContext(AppContext).setter;
    const [showEditor, setEditor] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const TASK_TITLE_MAX_LENGTH = 45;
    const TASK_CONTENT_MAX_LENGTH = 400;

    async function onSubmit(title, content) {
        title = title.trim();
        content = content.trim();
        const data = {
            title: title,
            content: content,
            ownerId: userId,
            completed: false,
            createdAt: serverTimestamp()
        }
        const transaction = await addItemIntoFirestore("tasks", data);
        data.id = transaction.data;
        transaction.status === "Success" ? addState(data) : setErrorMessage("An Error Occurred: " + transaction.data);
        setEditor(false);
    }

    function addState(data) {
        setTasks(produce((draft) => {
            draft.unshift(data);
        }));
    }

    function validation(title, content) {
        title = title.trim();
        content = content.trim();
        const isRuleBroken = title > TASK_TITLE_MAX_LENGTH || content > TASK_CONTENT_MAX_LENGTH || title.length === 0
        if (isRuleBroken) {
            setErrorMessage("An error occurred: Habit fields exceed max length or contains invalid content");
        }
        return !isRuleBroken
    }

    return (
        <div className={`pt-5`}>
            <ContentBlurred showEditor={showEditor}>
                <Button text={"Add Task"} size={15} onClick={() => setEditor(!showEditor)}/>
                <p>{errorMessage}</p>
                <h1>Tasks</h1>
                <TasksList taskList={tasks} setTaskList={setTasks}/>
            </ContentBlurred>
            {showEditor && <EditorPopup header={"Add a new task"} visible={showEditor} onCancel={() => setEditor(false)}
                                        validation={validation} onSubmit={onSubmit}/>}
        </div>
    );
}
