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
import LogTab from "./LogTab.jsx";
import backendAddLogs from "../../../Utils/backend/backendAddLogs.js";

export default function DetailView() {
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

    useEffect(() => {
        getItemFromFirestore(habitId, "habits").then(resp => {
            if (resp.status === "Success") {
                resp.data.id = habitId;
                setHabitInfo(resp.data);
            } else {
                setError(resp.status === "Error" ? resp.data : "An unknown error occurred");
            }
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

    function logEntryAllowed() {
        if (logs.length === 0) {
            return true;
        }
        const lastLogCreatedTime = DateTime.fromSeconds(logs[0].createdAt.seconds).startOf("day");
        const now = DateTime.now().startOf("day");
        return !lastLogCreatedTime.equals(now) && checkHabitCompleted(habitInfo.records);
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
                    <div className={"flex flex-row gap-x-2 mt-4"}>
                        <ToggleHabitIndicator habitId={habitId} callback={updatedToggleState} variant={"HabitDetail"}>
                            <Button text={"Toggle Habit"}/>
                        </ToggleHabitIndicator>
                        <EditValue setShowEditor={setHabitInfoEditor}
                                   callback={toggleHabitInfoEditor}/>
                        <DeleteItem buttonText={"Delete Habit"} itemId={habitId} collectionName={"habits"}
                                    callback={() => setRedirect("/")}/>
                    </div>
                    <p>{JSON.stringify(habitInfo)}</p>
                    <h2>Stats</h2>
                    <h3>Start
                        Day: {DateTime.fromSeconds(habitInfo.createdAt.seconds).toISODate()} {DateTime.fromSeconds(habitInfo.createdAt.seconds).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET)}</h3>
                    <Stats logs={logs}/>
                    <HabitCompletedDaysCalendar completedDates={habitInfo.records}/>
                </div>

                <div hidden={currentSelected !== "Logs"}>
                    <LogTab logEditor={logEditor} setLogEditor={setLogEditor} logs={logs} />
                </div>
                </ContentBlurred>
                <EditorPopup header={"Craeate a new log"} visible={logEditor} validation={logEntryAllowed} onCancel={()=>setLogEditor(false)} onSubmit={submitLog}></EditorPopup>
            </div>

        )
    }
    return <div>{error}</div>

}