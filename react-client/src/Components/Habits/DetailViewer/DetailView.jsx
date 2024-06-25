import {Navigate, useParams} from "react-router-dom";
import {useContext, useEffect, useMemo, useState} from "react";
import getItemFromFirestore from "../../../Utils/getItemFromFirestore.js";
import HabitCompletedDaysCalendar from "../Calendar/HabitCompletedDaysCalendar.jsx";
import DeleteHabit from "../DeleteHabit.jsx";
import EditValue from "./EditValue.jsx";
import updateItemInsideFirestore from "../../../Utils/updateItemInsideFirestore.js";
import {produce} from "immer";
import queryItemFromFirestore from "../../../Utils/queryItemFromFirestore.js";
import {data} from "autoprefixer";
import addItemIntoFirestore from "../../../Utils/addItemIntoFirestore.js";
import {Auth} from "../../Contexts/AuthContext.jsx";
import {serverTimestamp} from "firebase/firestore";

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
    console.log(habitId);

    useEffect(() => {
        getItemFromFirestore(habitId, "habits").then(resp => {
            console.log(resp);
            if (resp.status === "Success") {
                setHabitInfo(resp.data);
            } else if (resp.status === "Error") {
                setError(resp.data);
            } else {
                setError("An unknown error occurred");
            }
        });
        queryItemFromFirestore("logs", "habitOwner", habitId).then(data => {
            console.log(data);
            setLogs(data);
        })
    }, [])


    function editHabitDetails(e) {
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

    function addNewLog(e) {
        e.preventDefault();
        setLogTitle(produce(draft => draft.trim()));
        setLogContent(produce(draft => draft.trim()));
        const data = {
            "title": logTitle,
            "content": logContent,
            "ownerId": userId,
            "habitOwner": habitId,
            "createdAt": serverTimestamp(),
        }
        console.log("Adding this data: ");
        console.log(data);
        addItemIntoFirestore("logs", data).then(e => {
            console.log(e.status)
            console.log(e.id)
            console.log(e.data());
        })
    }


    if (redirect) {
        return <Navigate to={redirect}/>
    }
    if (habitInfo) {
        return (
            <div>
                <div>
                    {showEditor ?
                        <form onSubmit={editHabitDetails}>
                            <input placeholder={habitInfo.title}/><br/>
                            <input placeholder={habitInfo.missionStatement}/>
                            <input type={"submit"}/>
                        </form> :
                        <div>{habitInfo.title}<br/>{habitInfo.missionStatement}</div>
                    }
                </div>
                <EditValue setShowEditor={setShowEditor}/>

                <p>{JSON.stringify(habitInfo)}</p>
                <HabitCompletedDaysCalendar completedDates={habitInfo.records}/>
                <DeleteHabit documentId={habitId} onClick={() => setRedirect("/")}/>

                <h2>Logs</h2>
                {logs.map(content =>
                    <div>{JSON.stringify(content)}<br/><br/><br/></div>)}

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
            </div>
        )
    }
    return <div>{error}</div>

}