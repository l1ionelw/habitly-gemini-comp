import {Navigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import getItemFromFirestore from "../../../Utils/getItemFromFirestore.js";
import HabitCompletedDaysCalendar from "../Calendar/HabitCompletedDaysCalendar.jsx";
import DeleteItem from "../../DeleteItem.jsx";
import queryItemFromFirestore from "../../../Utils/queryItemFromFirestore.js";
import LogViewer from "./LogViewer.jsx";
import AddLog from "./AddLog.jsx";
import HabitDetailEditor from "./HabitDetailEditor.jsx";
import {produce} from "immer";
import updateItemInsideFirestore from "../../../Utils/updateItemInsideFirestore.js";
import ToggleHabitIndicator from "../ToggleHabitIndicator.jsx";
import {DateTime} from "luxon";
import EditValue from "./EditValue.jsx";
import Button from "../../UI/Button.jsx";
import HabitCard from "../../UI/HabitCard.jsx";
import checkHabitCompleted from "../../../Utils/habits/checkHabitCompleted.js";
import Statcard from "../../UI/Statcard.jsx";
import FireSVG from "../../Icons/FireSVG.jsx";
import CheckmarkSVG from "../../Icons/CheckmarkSVG.jsx";
import XmarkSVG from "../../Icons/XmarkSVG.jsx";
import CalendarDaysSVG from "../../Icons/CalendarDaysSVG.jsx";
import BookLogJournalSVG from "../../Icons/BookLogJournalSVG.jsx";
import {AppContext} from "../../Contexts/AppContext.jsx";
import TopBar from "../../TopBar/index.jsx";

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

    function getTotalTimeSinceStart(formatted) {
        const startDay = DateTime.fromSeconds(habitInfo.createdAt.seconds);
        const today = DateTime.now();
        const diff = today.diff(startDay, ["days", "hours", "minutes"]);
        return formatted ? `${diff.days}d ${diff.hours}h` : {"days": diff.days, "hours": diff.hours};
    }

    function getDaysCompleted() {
        if (!habitInfo.records) return 0;
        return habitInfo.records.length;
    }

    function getDaysIncomplete() {
        return getTotalTimeSinceStart().days - getDaysCompleted();
    }

    function getLogsCount() {
        return logs.length;
    }

    function getCurrentStreak() {
        if (habitInfo.records.length === 0) {
            console.log("no days yet")
            return "0d";
        }
        // TODO: check this later
        let startRange, endRange;
        let today = DateTime.now().startOf("day");
        let lastCompleted = DateTime.fromMillis(habitInfo.records[0]).startOf("day");
        let compDate;
        let startIndex = 1;
        if (today.equals(lastCompleted)) {
            startRange = today;
            compDate = today;
        }
        if (today.diff(lastCompleted, ["days"]).days === 1) {
            startRange = lastCompleted;
            compDate = lastCompleted;
        }
        if (!compDate) {
            console.log("Habit wasn't completed today or yesterday, no streak");
            return 0
        }

        for (let i = startIndex; i < habitInfo.records.length; i++) {
            let thisDate = DateTime.fromMillis(habitInfo.records[i]).startOf("day");
            if (compDate.diff(thisDate, ["days"]).days !== 1) {
                endRange = compDate;
                break
            }
            compDate = thisDate;
        }
        return startRange.diff(endRange, ["days"]).days + 1;
    }

    function getLongestStreak() {
        if (habitInfo.records.length === 0) {
            return 0;
        }
        // TODO: check this later
        let longestStreak = 0;
        let startRange = DateTime.fromMillis(habitInfo.records[0]).startOf("day");
        let compDate = DateTime.fromMillis(habitInfo.records[0]).startOf("day");
        let endRange;

        for (let day of habitInfo.records) {
            let thisDate = DateTime.fromMillis(day).startOf("day");
            if (compDate.diff(thisDate, ["day"]).days !== 1) {
                endRange = compDate;
                longestStreak = Math.max(longestStreak, startRange.diff(endRange, ["days"]).days + 1);
                startRange = thisDate;
            }
            compDate = thisDate;
        }
        return longestStreak;
    }

    function toggleHabitInfoEditor() {
        // using ! doesnt work for some reason, will check later;
        if (habitInfoEditor) {
            setHabitInfoEditor(false)
        } else {
            setHabitInfoEditor(true);
        }
    }

    if (redirect) {
        return <Navigate to={redirect}/>
    }
    if (habitInfo) {
        return (
            <div className={"pt-4"}>
                <TopBar elements={topBarElements} currentElement={currentSelected} setCurrentElement={setCurrentSelected}/>
                {habitInfoEditor && (
                    <HabitCard className={habitCardClassname}>
                        <HabitDetailEditor
                            title={habitInfo.title}
                            missionStatement={habitInfo.missionStatement}
                            showEditor={habitInfoEditor}
                            setShowEditor={setHabitInfoEditor}
                            width={"350px"}
                            callback={updateHabitDetails}
                        />
                    </HabitCard>
                )}
                {!habitInfoEditor && (<HabitCard className={habitCardClassname}><h1>{habitInfo.title}</h1>
                    <p>{habitInfo.missionStatement}</p></HabitCard>)}
                <div hidden={currentSelected !== "Details"}>


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
                    <div className={"flex flex-row gap-x-3 mb-3"}>
                        <Statcard title={"Current Streak"} content={getCurrentStreak()}
                                  svgPath={<FireSVG fill={"#ff9600"}/>}/>
                        <Statcard title={"Longest Streak"} content={getLongestStreak()}
                                  svgPath={<FireSVG fill={"#4eb600"}/>}/>

                        <Statcard title={"Days completed"} content={getDaysCompleted()} svgPath={<CheckmarkSVG/>}/>
                    </div>
                    <div className={"flex flex-row gap-x-3 mb-3"}>
                        <Statcard title={"Days not completed"} content={getDaysIncomplete()} svgPath={<XmarkSVG/>}/>
                        <Statcard title={"Days since started"} content={getTotalTimeSinceStart(true)}
                                  svgPath={<CalendarDaysSVG/>}/>
                        <Statcard title={"Total log entries"} content={getLogsCount()} svgPath={<BookLogJournalSVG/>}/>
                    </div>
                    <HabitCompletedDaysCalendar completedDates={habitInfo.records}/>

                    <h2>Logs</h2>
                    <AddLog logs={logs} setLogs={setLogs} habitInfo={habitInfo}/>
                    <LogViewer habitId={habitId} logs={logs} setLogs={setLogs}/>
                </div>


            </div>
        )
    }
    return <div>{error}</div>

}