import {DateTime} from "luxon";
import checkHabitCompleted from "../../../Utils/habits/checkHabitCompleted.js";
import {produce} from "immer";
import backendAddLogs from "../../../Utils/backend/backendAddLogs.js";
import {useState} from "react";

export default function AddLog({logs, setLogs, habitInfo}) {
    const [logTitle, setLogTitle] = useState("");
    const [logContent, setLogContent] = useState("");
    const LOG_TITLE_MAX_CHARS = 45;
    const LOG_CONTENT_MAX_CHARS = 700;

    function logEntryAllowed() {
        if (logs.length === 0) {
            return true;
        }
        const lastLogCreatedTime = DateTime.fromSeconds(logs[0].createdAt.seconds).startOf("day");
        const now = DateTime.now().startOf("day");
        return !lastLogCreatedTime.equals(now) && checkHabitCompleted(habitInfo.records);
    }

    async function addNewLog(e) {
        e.preventDefault();
        setLogTitle(produce(draft => draft.trim()));
        setLogContent(produce(draft => draft.trim()));
        let newLog = await backendAddLogs(habitInfo.id, logTitle, logContent);
        console.log(newLog);
        if (newLog.status === "Error") {
            return console.log(newLog.data);
        }
        console.log(newLog.data);
        setLogs(produce(draft => {
            draft.unshift(newLog.data);
        }))
    }
    return (
        <form onSubmit={addNewLog}>
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
            <input type={"submit"} value={"Add Log"} disabled={!logEntryAllowed()}/>
        </form>
    )
}