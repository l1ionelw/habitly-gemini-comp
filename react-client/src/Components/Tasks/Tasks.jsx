import React, {useContext, useEffect, useState} from 'react';
import TasksList from "./TasksList.jsx";
import Button from "../UI/Button.jsx";
import ContentBlurred from "../UI/ContentBlurred.jsx";
import {AppContext} from "../Contexts/AppContext.jsx";
import EditorPopup from "../UI/EditorPopup.jsx";
import {serverTimestamp} from "firebase/firestore";
import addItemIntoFirestore from "../../Utils/addItemIntoFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import {produce} from "immer";
import { DateTime } from 'luxon';

export default function Tasks() {
    const userId = useContext(Auth).user.uid;
    const tasks = useContext(AppContext).getter;
    const setTasks = useContext(AppContext).setter;
    const [showEditor, setEditor] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const filterTypes = ["Time", "Completed"];
    const filterOrders = ["Ascending", "Descending"];
    const [filterTypeIndex, setFilterTypeIndex] = useState(1);
    const [filterOrderIndex, setFilterOrderIndex] = useState(1);
    const filterType = filterTypes[filterTypeIndex];
    const filterOrder = filterOrders[filterOrderIndex];
    const TASK_TITLE_MAX_LENGTH = 45;
    const TASK_CONTENT_MAX_LENGTH = 400;

    useEffect(() => {
        if (filterTypeIndex > filterTypes.length - 1) {
            setFilterTypeIndex(0);
        }
        if (filterOrderIndex > filterOrders.length - 1) {
            setFilterOrderIndex(0);
        }
    }, [filterTypeIndex, filterOrderIndex]);

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
        data.createdAt = {seconds: DateTime.now().toSeconds()};
        transaction.status === "Success" ? addState(data) : setErrorMessage("An Error Occurred: " + transaction.data);
        setEditor(false);
    }

    function addState(data) {
        console.log(data);
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
                <div className={"flex gap-x-3"}>
                    <Button text={"Add Task"} size={15} onClick={() => setEditor(!showEditor)}/>
                    <Button text={`Filter Type: ${filterType}`} size={15}
                            onClick={() => setFilterTypeIndex(filterTypeIndex + 1)}/>
                    <Button text={`Filter Order: ${filterOrder}`} size={15}
                            onClick={() => setFilterOrderIndex(filterOrderIndex + 1)}/>
                </div>
                <p>{errorMessage}</p>
                <h1>Tasks</h1>
                <TasksList filterType={filterType} filterOrder={filterOrder}/>
            </ContentBlurred>
            {showEditor && <EditorPopup header={"Add a new task"} visible={showEditor} onCancel={() => setEditor(false)}
                                        validation={validation} onSubmit={onSubmit}/>}
        </div>
    );
}
