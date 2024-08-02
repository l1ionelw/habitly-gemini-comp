import React, {useState} from 'react';
import Button from "../UI/Button.jsx";
import LogViewer from "./LogViewer.jsx";
import SingleLogView from "./SingleLogView.jsx";

export default function LogTab({children, prohibitedMessage, setLogEditor, logEditor, logs, setLogs, logAllowed, updateFunction, deleteFunction}) {
    const [viewState, setViewState] = useState("AllLogs");
    const [logInfo, setLogInfo] = useState();
    if (viewState === "SingleLog") {
        return <SingleLogView setViewState={setViewState} logInfo={logInfo} setLogInfo={setLogInfo} setLogs={setLogs} updateFunction={updateFunction} deleteFunction={deleteFunction}/>
    } else {
        return (
            <div>
                <Button text={"New log"} size={12} onClick={() => setLogEditor(!logEditor)} disabled={!logAllowed} />
                {!logAllowed && <p>{prohibitedMessage}</p>}
                <h2>Logs</h2>
                <div className={"mb-5"}>
                    {children}
                </div>
                <LogViewer setViewInfo={setLogInfo} setViewState={setViewState} logs={logs} />
            </div>
        )
    }
}
