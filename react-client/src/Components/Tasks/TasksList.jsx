import React, {useContext, useEffect, useMemo, useState} from 'react';
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import TaskEntry from "./TaskEntry.jsx";
import {AppContext} from "../Contexts/AppContext.jsx";
import taskSorter from './Utils/taskSorter.js';

export default function TasksList({filterType, filterOrder}) {
    const taskList = useContext(AppContext).getter;
    const setTaskList = useContext(AppContext).setter;
    const userId = useContext(Auth).user.uid;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!filterType || !filterOrder) {
            return;
        }
        setTaskList(taskSorter(taskList, filterType, filterOrder));
    }, [filterType, filterOrder]);


    useEffect(() => {
        queryItemFromFirestore("tasks", "ownerId", userId).then(data => {
            if (data) {
                if (data.length === 0) setTaskList("No Tasks");
                setTaskList(taskSorter(data, filterType, filterOrder));
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
