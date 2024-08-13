import {Navigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import getItemFromFirestore from "../../../Utils/getItemFromFirestore.js";
import HabitCompletedDaysCalendar from "../Calendar/HabitCompletedDaysCalendar.jsx";
import DeleteItem from "../../DeleteItem.jsx";
import queryItemFromFirestore from "../../../Utils/queryItemFromFirestore.js";
import {produce} from "immer";
import updateItemInsideFirestore from "../../../Utils/updateItemInsideFirestore.js";
import ToggleHabitIndicator from "../ToggleHabitIndicator.jsx";
import {DateTime} from "luxon";
import EditValue from "./EditValue.jsx";
import Button from "../../UI/Button.jsx";
import checkHabitCompleted from "../../../Utils/habits/checkHabitCompleted.js";
import {AppContext} from "../../Contexts/AppContext.jsx";
import TopBar from "../../TopBar/index.jsx";
import Stats from "./Stats.jsx";
import MainHabitCard from "./MainHabitCard.jsx";
import ContentBlurred from "../../UI/ContentBlurred.jsx";
import EditorPopup from "../../UI/EditorPopup.jsx";
import LogTab from "../../Logs/LogTab.jsx";
import backendAddLogs from "../../../Utils/backend/backendAddLogs.js";
import Loading from "../../Loading.jsx";
import checkLogEntryAllowed from "./Utils/checkLogEntryAllowed.js";
import AiCard from "../../UI/AiCard.jsx";
import generateHabitTips from "../../Ai/Utils/generateHabitTips.js";
import backendUpdateLogs from "../../../Utils/backend/backendUpdateLogs.js";
import backendDeleteLogs from "../../../Utils/backend/backendDeleteLogs.js";
import generateLogSummaries from "../../Ai/ComponentUtils/generateLogSummaries.js";

export default function DetailView() {
    const [isLoading, setIsLoading] = useState(true);
    const habitId = useParams().habitId;
    const habitInfo = useContext(AppContext).getter;
    const setHabitInfo = useContext(AppContext).setter;
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState("");
    const [logs, setLogs] = useState([]);
    const [habitInfoEditor, setHabitInfoEditor] = useState(false);
    const habitCardClassname = `mb-5 ${checkHabitCompleted(habitInfo?.records) ? "item-completed" : "item-incomplete"}`
    const topBarElements = ["Details", "Logs"];
    const [currentSelected, setCurrentSelected] = useState("Details");
    const [logEditor, setLogEditor] = useState(false);
    const lowEntryAllowed = checkLogEntryAllowed(habitInfo?.records, logs);
    const [aiState, setAiState] = useState("Idle");
    const [aiMessage, setAiMessage] = useState("");
    const buttonSize = 13;


    useEffect(() => {
        getItemFromFirestore(habitId, "habits").then(resp => {
            if (resp.status === "Success") {
                resp.data.id = habitId;
                setHabitInfo(resp.data);
            } else {
                setError(resp.status === "Error" ? resp.data : "An unknown error occurred");
            }
            setIsLoading(false);
        });
        queryItemFromFirestore("logs", "habitOwner", habitId).then(data => {
            data = data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
            setLogs(data);
        })
    }, [])

    function updatedToggleState(newRecords) {
        setHabitInfo(produce(draft => {
            draft.records = newRecords
        }))
    }

    function updateHabitDetails(updatedTitle, updatedMissionStatement) {
        updateItemInsideFirestore("habits", habitId, {
            "title": updatedTitle,
            "missionStatement": updatedMissionStatement
        }).then((e) => {
            console.log(e);
            setHabitInfo(produce(draft => {
                draft.title = updatedTitle;
                draft.missionStatement = updatedMissionStatement;
            }))
        })
    }

    function toggleHabitInfoEditor() {
        // using ! doesnt work for some reason, will check later;
        if (habitInfoEditor) {
            setHabitInfoEditor(false)
        } else {
            setHabitInfoEditor(true);
        }
    }

    async function submitLog(title, content) {
        title = title.trim();
        content = content.trim();
        let newLog = await backendAddLogs(habitInfo.id, title, content);
        if (newLog.status === "Error") {
            return console.log(newLog.data);
        }
        setLogs(produce(draft => {
            draft.unshift(newLog.data);
        }));
        setLogEditor(false);
    }

    async function updateLog(id, newTitle, newContent, habitOwner) {
        console.log("updating habit log");
        return backendUpdateLogs(id, newTitle, newContent, habitOwner)
    }

    async function deleteLog(habitOwner) {
        console.log("deleting habit log");
        return backendDeleteLogs(habitOwner)
    }

    function generateAiTips() {
        setAiState("Loading");
        generateHabitTips(habitInfo.title, habitInfo.missionStatement).then((response) => {
            console.log(response);
            setAiMessage(response);
            setAiState("Done")
        }).catch((err => {
            console.log(err);
            setAiState("Error")
        }))
    }

    async function callGenerateLogSummary(type) {
        setAiState("Loading");
        await generateLogSummaries(logs, type).then((resp) => {
            setAiMessage(resp);
        })
        setAiState("Done");
    }

    if (isLoading) {
        return <Loading/>
    }
    if (redirect) {
        return <Navigate to={redirect}/>
    }

    if (habitInfo) {
        return (
            <div className={"pt-4"}>
                <ContentBlurred showEditor={logEditor}>
                    <TopBar elements={topBarElements} currentElement={currentSelected}
                            setCurrentElement={setCurrentSelected}/>
                    <MainHabitCard
                        habitInfoEditor={habitInfoEditor}
                        habitCardClassname={habitCardClassname}
                        setHabitInfoEditor={setHabitInfoEditor}
                        updateHabitDetails={updateHabitDetails}
                    />

                    <div hidden={currentSelected !== "Details"} className={"pb-10"}>
                        {checkHabitCompleted(habitInfo.records) ? "Habit is completed today" : "Habit is not completed"}
                        <div className={"flex flex-row gap-x-2 mt-4 mb-5"}>
                            <ToggleHabitIndicator habitId={habitId} callback={updatedToggleState}
                                                  variant={"HabitDetail"}>
                                <Button text={"Toggle Habit"}/>
                            </ToggleHabitIndicator>
                            <EditValue setShowEditor={setHabitInfoEditor}
                                       callback={toggleHabitInfoEditor}/>
                            <DeleteItem buttonText={"Delete Habit"} variant={"Habits"} itemId={habitId}
                                        collectionName={"habits"}
                                        callback={()=>setRedirect("/habits")}/>
                        </div>
                        {aiState !== "Unloaded" &&
                            <AiCard state={aiState} setState={setAiState} onClickAction={() => generateAiTips()}
                                    message={aiMessage}/>}
                        <h2>Stats</h2>
                        <h3>Start
                            Day: {DateTime.fromSeconds(habitInfo.createdAt.seconds).toISODate()} {DateTime.fromSeconds(habitInfo.createdAt.seconds).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET)}</h3>
                        <Stats logs={logs}/>
                        <HabitCompletedDaysCalendar completedDates={habitInfo.records}/>
                    </div>
                    <div hidden={currentSelected !== "Logs"}>
                        <LogTab
                            prohibitedMessage={"You can only add a log when your habit is already completed and if you haven't already created a log today"}
                            logEditor={logEditor} setLogEditor={setLogEditor} logs={logs} logAllowed={lowEntryAllowed}
                            setLogs={setLogs} updateFunction={updateLog} deleteFunction={deleteLog}>
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
                                        <Button text={"Last 3 Months"} size={buttonSize}
                                                onClick={() => callGenerateLogSummary("3Months")}/>
                                        <Button text={"Last 6 Months"} size={buttonSize}
                                                onClick={() => callGenerateLogSummary("6Months")}/>
                                        <Button text={"Last Year"} size={buttonSize}
                                                onClick={() => callGenerateLogSummary("1Year")}/>
                                    </div>
                                </AiCard>
                            }
                        </LogTab>
                    </div>
                </ContentBlurred>
                <EditorPopup header={"Create a new log"} visible={logEditor}
                             validation={() => checkLogEntryAllowed(habitInfo.records, logs)}
                             onCancel={() => setLogEditor(false)} onSubmit={submitLog}></EditorPopup>
            </div>

        )
    }
    return <div>{error}</div>

}