import {Navigate, useParams} from "react-router-dom";
import {useContext, useEffect, useMemo, useState} from "react";
import getItemFromFirestore from "../../../Utils/getItemFromFirestore.js";
import HabitCompletedDaysCalendar from "../Calendar/HabitCompletedDaysCalendar.jsx";
import DeleteHabit from "../DeleteHabit.jsx";
import EditValue from "./EditValue.jsx";
import updateItemInsideFirestore from "../../../Utils/updateItemInsideFirestore.js";
import {produce} from "immer";
import queryItemFromFirestore from "../../../Utils/queryItemFromFirestore.js";
import addItemIntoFirestore from "../../../Utils/addItemIntoFirestore.js";
import {Auth} from "../../Contexts/AuthContext.jsx";
import {serverTimestamp} from "firebase/firestore";
import checkHabitCompleted from "../../../Utils/habits/checkHabitCompleted.js";
import {DateTime} from "luxon";

export default function DetailView() {
    const userId = useContext(Auth).user.uid;
    const habitId = useParams().habitId;

    const [habitInfo, setHabitInfo] = useState();
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState("");
    const [showEditor, setShowEditor] = useState(false);
    const [logs, setLogs] = useState([]);

    const [logTitle, setLogTitle] = useState("");
    const [logContent, setLogContent] = useState("");
    const LOG_TITLE_MAX_CHARS = 45;
    const LOG_CONTENT_MAX_CHARS = 700;

    useEffect(() => {
        getItemFromFirestore(habitId, "habits").then(resp => {
            if (resp.status === "Success") {
                setHabitInfo(resp.data);
            } else if (resp.status === "Error") {
                setError(resp.data);
            } else {
                setError("An unknown error occurred");
            }
        });
        queryItemFromFirestore("logs", "habitOwner", habitId).then(data => {
            console.log("fetched logs")
            data = data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
            setLogs(data);
        })
    }, [])

    function updateHabitDetails(e) {
        e.preventDefault();
        const newTitle = e.target[0].value.trim();
        const newMissionStatement = e.target[1].value.trim();
        updateItemInsideFirestore("habits", habitId, {
            "title": newTitle,
            "missionStatement": newMissionStatement
        }).then((e) => {
            setShowEditor(false);
            setHabitInfo(produce(draft => {
                draft.title = newTitle;
                draft.missionStatement = newMissionStatement;
            }))
        })
    }

    function logEntryAllowed() {
        if (logs.length === 0) {
            return true;
        }
        const lastLogCreatedTime = DateTime.fromSeconds(logs[0].createdAt.seconds).startOf("day");
        const now = DateTime.now().startOf("day");
        return !lastLogCreatedTime.equals(now) && checkHabitCompleted(habitInfo.records);
        // get most recent logs
        // if logs !== today & habit completed return true
    }

    function addNewLog(e) {
        e.preventDefault();
        setLogTitle(produce(draft => draft.trim()));
        setLogContent(produce(draft => draft.trim()));
        const data = {
            "title": logTitle,
            "content": logContent,           "ownerId": userId,
            "habitOwner": habitId,
            "createdAt": serverTimestamp(),
        }
        console.log("Adding this data: ");
        console.log(data);
        addItemIntoFirestore("logs", data).then(e => {
        })
    }


    if (redirect) {
        return <Navigate to={redirect}/>
    }
    if (habitInfo) {
        return (
            <div>
                <h1>Habit Details</h1>
                {showEditor ?
                    <form onSubmit={updateHabitDetails}>
                        <input placeholder={habitInfo.title}/><br/>
                        <input placeholder={habitInfo.missionStatement}/>
                        <input type={"submit"}/>
                    </form> :
                    <div><strong>Habit Name: </strong>{habitInfo.title}<br/><strong>Mission
                        Statement: </strong>{habitInfo.missionStatement}</div>
                }
                <br/>
                <EditValue setShowEditor={setShowEditor}/>
                <DeleteHabit documentId={habitId} onClick={() => setRedirect("/")}/>

                <p>{JSON.stringify(habitInfo)}</p>
                <HabitCompletedDaysCalendar completedDates={habitInfo.records}/>

                <h2>Logs</h2>
                <form onSubmit={addNewLog}>
                    <input placeholder={"title"}
                           value={logTitle} onChange={(e) => setLogTitle(e.target.value)}
                           maxLength={LOG_TITLE_MAX_CHARS}
                    />
                    <br/>
                    <textarea placeholder={"reflect on your habit today"}
                              value={logContent}
                              onChange={e => setLogContent(e.target.value)}
                              maxLength={LOG_CONTENT_MAX_CHARS}
                    />
                    <br/>
                    <input type={"submit"}/>
                </form>
                <p>{logEntryAllowed() ? "Allowed" : "Not allowed"}</p>

                {logs.map(content =>
                    <div><h3>{content.title}</h3>{JSON.stringify(content)}<br/><br/><br/></div>)}
            </div>
        )
    }
    return <div>{error}</div>

}