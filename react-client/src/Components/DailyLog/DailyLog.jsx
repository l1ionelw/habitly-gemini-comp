import React, {useContext, useEffect, useState} from 'react';
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import LogTab from "../Logs/LogTab.jsx";
import EditorPopup from "../UI/EditorPopup.jsx";
import {DateTime} from "luxon";
import {produce} from "immer";
import backendAddDailyLog from "../../Utils/backend/backendAddDailyLog.js";
import backendDeleteDailyLog from "../../Utils/backend/backendDeleteDailyLog.js";
import backendUpdateDailyLog from "../../Utils/backend/backendUpdateDailyLog.js";
import AiCard from "../UI/AiCard.jsx";
import Button from "../UI/Button.jsx";
import generateLogSummaries from "../Ai/ComponentUtils/generateLogSummaries.js";

export default function DailyLog() {
    const userId = useContext(Auth).user.uid;
    const [logs, setLogs] = useState([]);
    const [logEditor, setLogEditor] = useState(false);
    const entryAllowedToday = logEntryAllowed();
    const [aiMessage, setAiMessage] = useState("");
    const [aiState, setAiState] = useState("Idle");
    const buttonSize = 13;

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

    async function updateLog(logId, title, content) {
        console.log("updating daily log");
        return backendUpdateDailyLog(logId, title, content)
    }

    async function deleteLog(habitOwner, logId) {
        console.log(logId)
        console.log("deleting daily log");
        return backendDeleteDailyLog(logId);
    }

    async function callGenerateLogSummary(type) {
        setAiState("Loading");
        await generateLogSummaries(logs, type).then((resp) => {
            setAiMessage(resp);
        })
        setAiState("Done");
    }

    return (
        <div>
            <LogTab prohibitedMessage={"You can only add one log per day"} logs={logs} setLogs={setLogs}
                    logEditor={logEditor} setLogEditor={setLogEditor} logAllowed={entryAllowedToday}
                    updateFunction={updateLog} deleteFunction={deleteLog}>
                {
                    aiState !== "Unloaded" &&
                    <AiCard
                        message={aiMessage}
                        state={aiState}
                        setState={setAiState}
                        onClickAction={generateLogSummaries}>
                        <p>Generate log summaries by: </p>
                        <div className={"flex gap-x-2 gap-y-2 flex-wrap"}>
                            <Button text={"Last Week"} size={buttonSize}
                                    onClick={() => callGenerateLogSummary("1Week")}/>
                            <Button text={"Last Month"} size={buttonSize}
                                    onClick={() => callGenerateLogSummary("1Month")}/>
                        </div>
                    </AiCard>
                }
            </LogTab>
            {logEditor &&
                <EditorPopup header={"Create a new daily log"} visible={logEditor} validation={logEntryAllowed}
                             onCancel={() => setLogEditor(false)} onSubmit={submitLog}></EditorPopup>}
        </div>
    );
}
