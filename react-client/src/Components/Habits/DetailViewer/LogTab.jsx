import React, {useState} from 'react';
import Button from "../../UI/Button.jsx";
import LogViewer from "./LogViewer.jsx";
import SingleLogView from "./SingleLogView.jsx";
import HabitDetailLogsPanel from "../../Ai/HabitDetailLogsPanel.jsx";

export default function LogTab({setLogEditor, logEditor, logs}) {
    const [viewState, setViewState] = useState("AllLogs");
    const [logInfo, setLogInfo] = useState();
    if (viewState === "SingleLog") {
        return <SingleLogView setViewState={setViewState} logInfo={logInfo} setLogInfo={setLogInfo}/>
    } else {
        return (
            <div>
                <Button text={"New log"} size={12} onClick={() => setLogEditor(!logEditor)}/>
                <h2>Logs</h2>
                <HabitDetailLogsPanel/>
                <LogViewer setViewInfo={setLogInfo} setViewState={setViewState} logs={logs} />
            </div>
        )
    }
}
