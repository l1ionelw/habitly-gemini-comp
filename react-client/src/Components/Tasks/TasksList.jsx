import React, { useContext, useEffect, useMemo, useState } from 'react';
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import { Auth } from "../Contexts/AuthContext.jsx";
import TaskEntry from "./TaskEntry.jsx";
import { AppContext } from "../Contexts/AppContext.jsx";
import taskSorter from './Utils/taskSorter.js';

export default function TasksList() {
    const taskList = useContext(AppContext).getter;
    const setTaskList = useContext(AppContext).setter;
    const userId = useContext(Auth).user.uid;
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("Completed"); // time, completed
    const [filterOrder, setFilterOrder] = useState("Ascending"); // ascending, descending

    useEffect(() => {
        queryItemFromFirestore("tasks", "ownerId", userId).then(data => {
            if (data) {
                if (data.length === 0) setTaskList("No Tasks");
                data = taskSorter(data, filterType, filterOrder);
                setTaskList(data);
            } else {
                setTaskList("Error");
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <h1>Loading</h1>
    }
    if (taskList === "No Tasks") {
        return <div>You have no tasks. </div>
    }
    if (taskList === "Error") {
        return <div>An unknown error occurred</div>
    }
    return (
        <div>
            <p>Current Filter Options: {filterType} | {filterOrder}</p>
            {taskList.map((task) =>
                <TaskEntry task={task} filterType={filterType} filterOrder={filterOrder}/>
            )}
        </div>
    );
}
