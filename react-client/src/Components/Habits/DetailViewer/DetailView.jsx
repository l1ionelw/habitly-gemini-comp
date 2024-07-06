import {Navigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import getItemFromFirestore from "../../../Utils/getItemFromFirestore.js";
import HabitCompletedDaysCalendar from "../Calendar/HabitCompletedDaysCalendar.jsx";
import DeleteHabit from "../DeleteHabit.jsx";
import queryItemFromFirestore from "../../../Utils/queryItemFromFirestore.js";
import LogViewer from "./LogViewer.jsx";
import AddLog from "./AddLog.jsx";
import HabitDetailEditor from "./HabitDetailEditor.jsx";
import {produce} from "immer";
import updateItemInsideFirestore from "../../../Utils/updateItemInsideFirestore.js";
import ToggleHabitIndicator from "../CompletedIndicator.jsx";
import {DateTime} from "luxon";
import EditValue from "./EditValue.jsx";
import Button from "../../UI/Button.jsx";
import HabitCard from "../../UI/HabitCard.jsx";
import checkHabitCompleted from "../../../Utils/habits/checkHabitCompleted.js";

export default function DetailView() {
    const habitId = useParams().habitId;

    const [habitInfo, setHabitInfo] = useState();
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState("");
    const [logs, setLogs] = useState([]);
    const [habitInfoEditor, setHabitInfoEditor] = useState(false);

    const habitCardClassname = `mb-5 ${checkHabitCompleted(habitInfo?.records) ? "habit-completed" : "habit-incomplete"}`

    useEffect(() => {
        console.log("fetching");
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
        console.log(habitInfoEditor);
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
                {habitInfoEditor && (
                    <HabitDetailEditor title={habitInfo.title} missionStatement={habitInfo.missionStatement}
                                       showEditor={habitInfoEditor} setShowEditor={setHabitInfoEditor}
                                       callback={updateHabitDetails}/>)
                }
                {!habitInfoEditor && (<div><HabitCard className={habitCardClassname}><h1>{habitInfo.title}</h1>
                    <p>{habitInfo.missionStatement}</p></HabitCard></div>)}
                {checkHabitCompleted(habitInfo.records) ? "Habit is completed today" : "Habit is not completed"}
                <div className={"flex flex-row gap-x-2 mt-4"}>
                    <ToggleHabitIndicator habitId={habitId} habitsList={habitInfo} setHabits={setHabitInfo}
                                        variant={"HabitDetail"}>
                        <Button text={"Toggle Habit"}/>
                    </ToggleHabitIndicator>
                    <EditValue setShowEditor={setHabitInfoEditor}
                               callback={toggleHabitInfoEditor}/>
                    <DeleteHabit habitId={habitId} callback={() => setRedirect("/")}/>
                </div>


                <p>{JSON.stringify(habitInfo)}</p>

                <h2>Stats</h2>
                <h3>Start Day: {DateTime.fromSeconds(habitInfo.createdAt.seconds).toISODate()}</h3>
                <p>Days since started: {getTotalTimeSinceStart(true)}</p>
                <p>Days completed: {getDaysCompleted()}</p>
                <p>Days not completed: {getDaysIncomplete()}</p>
                <p>Log Entries: {getLogsCount()}</p>
                <p>Streak: {getCurrentStreak()}</p>
                <p>Longest Streak: {getLongestStreak()}</p>

                <HabitCompletedDaysCalendar completedDates={habitInfo.records}/>

                <h2>Logs</h2>
                <AddLog logs={logs} setLogs={setLogs} habitInfo={habitInfo}/>
                <LogViewer habitId={habitId} logs={logs} setLogs={setLogs}/>
            </div>
        )
    }
    return <div>{error}</div>

}