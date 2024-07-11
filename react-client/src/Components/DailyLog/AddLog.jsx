import React, {useState} from 'react';
import backendAddDailyLog from "../../Utils/backend/backendAddDailyLog.js";
import {produce} from "immer";

export default function AddLog({setLogs}) {
    const [logTitle, setLogTitle] = useState("");
    const [logContent, setLogContent] = useState("");
    const LOG_TITLE_MAX_CHARS = 45;
    const LOG_CONTENT_MAX_CHARS = 700;

    async function addLog(e) {
        e.preventDefault();
        let newLog = await backendAddDailyLog(logTitle.trim(), logContent.trim());
        console.log(newLog);
        if (newLog.status === "Error") {
            return console.log(newLog.data);
        }
        console.log(newLog.data);
        setLogs(produce(draft => {
            draft.unshift(newLog.data);
        }))
        setLogTitle("");
        setLogContent("");
    }

    return (
        <div>
            <form onSubmit={addLog}>
                <input placeholder={"title"}
                       value={logTitle} onChange={(e) => setLogTitle(e.target.value)}
                       maxLength={LOG_TITLE_MAX_CHARS}
                />
                <br/>
                <textarea placeholder={"reflect on your habit today"}
                          value={logContent}
                          onChange={e => setLogContent(e.target.value)}
                          maxLength={LOG_CONTENT_MAX_CHARS}
                />
                <br/>
                <input type={"submit"} value={"Add Log"}/>
            </form>
        </div>
    );
}
