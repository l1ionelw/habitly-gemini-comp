import React, {useContext, useEffect, useState} from 'react';
import AddLog from "./AddLog.jsx";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";

export default function DailyLog() {
    const userId = useContext(Auth).user.uid;
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        queryItemFromFirestore("dailylogs", "ownerId", userId).then((data) => {
            data = data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
            setLogs(data);
        })
    }, []);

    return (
        <div>
            <AddLog setLogs={setLogs}/>
            <h1>Daily Log</h1>
            {logs.map((item)=>(
                <div>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                </div>
            ))
            }
        </div>
    );
}
