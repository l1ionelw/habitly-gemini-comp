import React, {useState} from 'react';
import Button from "../../UI/Button.jsx";
import LogViewer from "./LogViewer.jsx";
import SingleLogView from "./SingleLogView.jsx";

export default function LogTab({prohibitedMessage, setLogEditor, logEditor, logs, setLogs, logAllowed}) {
    const [viewState, setViewState] = useState("AllLogs");
    const [logInfo, setLogInfo] = useState();
    if (viewState === "SingleLog") {
        return <SingleLogView setViewState={setViewState} logInfo={logInfo} setLogInfo={setLogInfo} setLogs={setLogs}/>
    } else {
        return (
            <div>
                <Button text={"New log"} size={12} onClick={() => setLogEditor(!logEditor)} disabled={!logAllowed} />
                {!logAllowed && <p>{prohibitedMessage}</p>}
                <h2>Logs</h2>
                <LogViewer setViewInfo={setLogInfo} setViewState={setViewState} logs={logs} />
            </div>
        )
    }
}
