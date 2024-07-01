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
import CompletedIndicator from "../CompletedIndicator.jsx";

export default function DetailView() {
    const habitId = useParams().habitId;

    const [habitInfo, setHabitInfo] = useState();
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState("");
    const [logs, setLogs] = useState([]);

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



    if (redirect) {
        return <Navigate to={redirect} />
    }
    if (habitInfo) {
        return (
            <div>
                <h1>Habit Details</h1>
                <HabitDetailEditor title={habitInfo.title} missionStatement={habitInfo.missionStatement} callback={updateHabitDetails}/>
                <CompletedIndicator habitId={habitId} habitsList={habitInfo} setHabits={setHabitInfo} variant={"HabitDetail"}/>
                <DeleteHabit documentId={habitId} onClick={() => setRedirect("/")} />

                <p>{JSON.stringify(habitInfo)}</p>
                <HabitCompletedDaysCalendar completedDates={habitInfo.records} />

                <h2>Logs</h2>

                <AddLog logs={logs} setLogs={setLogs} habitInfo={habitInfo} />
                <LogViewer habitId={habitId} logs={logs} setLogs={setLogs} />
            </div>
        )
    }
    return <div>{error}</div>

}