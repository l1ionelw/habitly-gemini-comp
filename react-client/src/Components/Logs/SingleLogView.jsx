import React, {useState} from 'react';
import Button from "../UI/Button.jsx";
import HabitDetailEditor from "../Habits/DetailViewer/HabitDetailEditor.jsx";
import {DateTime} from "luxon";
import backendDeleteLogs from "../../Utils/backend/backendDeleteLogs.js";
import {produce} from "immer";
import backendUpdateLogs from "../../Utils/backend/backendUpdateLogs.js";
import getLogIndexById from '../Habits/Utils/getLogIndexById.js';

export default function SingleLogView({setViewState, setLogs, logInfo, setLogInfo, updateFunction, deleteFunction}) {
    const [showEditor, setShowEditor] = useState(false);

    async function updateLogContent(updatedTitle, updatedContent) {
        updatedTitle = updatedTitle.trim();
        updatedContent = updatedContent.trim();
        if (!logIsToday(logInfo)) {
            return console.log("unable to update log");
        }
        updateFunction(logInfo.id, updatedTitle, updatedContent, logInfo.habitOwner).then(e => {
            setLogInfo(produce(draft => {
                draft.title = updatedTitle;
                draft.content = updatedContent;
            }))
            setLogs(produce(draft => {
                const logIndex = getLogIndexById(draft, logInfo.id);
                draft[logIndex].title = updatedTitle;
                draft[logIndex].content = updatedContent
            }))
            setShowEditor(false);
        })
    }

    function logIsToday(log) {
        return DateTime.now().startOf("day").equals(DateTime.fromSeconds(log.createdAt.seconds).startOf("day"));
    }

    async function deleteLog() {
        if (window.confirm("Are you sure? This action cannot be undone!")) {
            deleteFunction(logInfo.habitOwner, logInfo.id).then(e => {
                setLogs(produce((draft => {
                    draft = draft.splice(0, 1);
                })))
                goBack();
            });
        }
    }

    function goBack() {
        setViewState("AllLogs");
    }

    return (<div>
        <div className={"flex gap-x-3"}>
            <Button text={"Back"} size={12} onClick={goBack}/>
            {logIsToday(logInfo) && <>
                <Button text={"Edit Log"} size={12} onClick={() => setShowEditor(!showEditor)}/>
                <Button text={"Delete Log"} onClick={deleteLog} size={12}/>
            </>}
        </div>

        {!showEditor && <>
            <h1>{logInfo.title}</h1>
            <p>{logInfo.content}</p>
        </>}
        {showEditor && <HabitDetailEditor
            title={logInfo.title}
            missionStatement={logInfo.content}
            callback={updateLogContent}
            variant={!logIsToday(logInfo) ? "NoEdit" : ""}
            textBoxWidth={"500px"}
        />}
    </div>);
}
