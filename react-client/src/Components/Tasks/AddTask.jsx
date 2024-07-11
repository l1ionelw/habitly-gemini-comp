import React, {useContext, useState} from 'react';
import Card from "../UI/Card.jsx";
import Button from "../UI/Button.jsx";
import {serverTimestamp} from "firebase/firestore";
import addItemIntoFirestore from "../../Utils/addItemIntoFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import {produce} from "immer";

export default function AddTask({setter, showEditor, setErrorMessage, callback}) {
    const userId = useContext(Auth).user.uid;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const TASK_TITLE_MAX_LENGTH = 45;
    const TASK_CONTENT_MAX_LENGTH = 400;

    async function onSubmit(e) {
        e.preventDefault();
        setErrorMessage("");
        const titleTrimmed = title.trim();
        const statementTrimmed = content.trim();
        if (titleTrimmed > TASK_TITLE_MAX_LENGTH || statementTrimmed > TASK_CONTENT_MAX_LENGTH || titleTrimmed.length === 0) {
            setErrorMessage("An error occurred: Habit fields exceed max length or contains invalid content");
        }
        const data = {
            title: titleTrimmed,
            content: statementTrimmed,
            ownerId: userId,
            completed: false,
            createdAt: serverTimestamp()
        }
        const transaction = await addItemIntoFirestore("tasks", data);
        transaction.status === "Success" ? handleAddSuccess(data, transaction.data) : setErrorMessage("An Error Occurred: " + transaction.data);
        callback();
    }

    function handleAddSuccess(data, docId) {
        setTitle("");
        setContent("");
        data.id = docId;
        setter(produce((draft) => {
            draft.unshift(data)
        }));
    }


    return (
        <div hidden={!showEditor} className={"centered-xy"}
             style={{backgroundColor: "lightblue", padding: "1rem 0.5rem", borderRadius: "0.2rem"}}>
            <Card>
                <h3>Add a task</h3>
                <form onSubmit={onSubmit}>
                    <div className={'flex flex-col gap-y-1'}>
                        <input
                            placeholder={"title"}
                            value={title} onChange={(e) => setTitle(e.target.value)}
                            maxLength={TASK_TITLE_MAX_LENGTH}
                            className={"styled-input"}
                        />
                        <textarea placeholder={"notes"}
                                  value={content}
                                  onChange={(e) => setContent(e.target.value)}
                                  maxLength={TASK_CONTENT_MAX_LENGTH}
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
    );
}
