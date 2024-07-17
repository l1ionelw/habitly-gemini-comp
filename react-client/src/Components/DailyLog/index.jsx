import React, {useContext, useEffect, useState} from 'react';
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import LogTab from "../Habits/DetailViewer/LogTab.jsx";
import EditorPopup from "../UI/EditorPopup.jsx";
import {DateTime} from "luxon";
import checkHabitCompleted from "../../Utils/habits/checkHabitCompleted.js";
import backendAddLogs from "../../Utils/backend/backendAddLogs.js";
import {produce} from "immer";
import backendAddDailyLog from "../../Utils/backend/backendAddDailyLog.js";

export default function DailyLog() {
    const userId = useContext(Auth).user.uid;
    const [logs, setLogs] = useState([]);
    const [logEditor, setLogEditor] = useState(false);

    useEffect(() => {
        queryItemFromFirestore("dailylogs", "ownerId", userId).then((data) => {
            data = data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
            setLogs(data);
        })
    }, []);
    function logEntryAllowed() {
        if (logs.length === 0) {
            return true;
        }
        const lastLogCreatedTime = DateTime.fromSeconds(logs[0].createdAt.seconds).startOf("day");
        const now = DateTime.now().startOf("day");
        return !lastLogCreatedTime.equals(now);
    }
    async function submitLog(title, content) {
        title = title.trim();
        content = content.trim();
        let newLog = await backendAddDailyLog(title, content);
        if (newLog.status === "Error") {
            return console.log(newLog.data);
        }
        setLogs(produce(draft => {
            draft.unshift(newLog.data);
        }))
        setLogEditor(false);
    }

    return (
        <div>
            <LogTab logs={logs} logEditor={logEditor} setLogEditor={setLogEditor}/>
            <EditorPopup header={"Create a new daily log"} visible={logEditor} validation={logEntryAllowed} onCancel={()=>setLogEditor(false)} onSubmit={submitLog}></EditorPopup>
        </div>
    );
}
