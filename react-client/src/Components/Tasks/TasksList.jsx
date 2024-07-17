import React, {useContext, useEffect, useState} from 'react';
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import DeleteItem from "../DeleteItem.jsx";
import {produce} from "immer";
import CompletedCircleIndicator from "../UI/CompletedCircleIndicator.jsx";
import TaskEntry from "./TaskEntry.jsx";
import getTaskIndexById from "../Habits/Utils/getTaskIndexById.jsx";
import Button from "../UI/Button.jsx";
import HabitDetailEditor from "../Habits/DetailViewer/HabitDetailEditor.jsx";
import updateItemInsideFirestore from "../../Utils/updateItemInsideFirestore.js";
import {AppContext} from "../Contexts/AppContext.jsx";

export default function TasksList() {
    const taskList = useContext(AppContext).getter;
    const setTaskList = useContext(AppContext).setter;
    const userId = useContext(Auth).user.uid;
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("Time"); // time, completed
    const [filterOptions, setFilterOptions] = useState("Descending"); // ascending, descending

    useEffect(() => {
        queryItemFromFirestore("tasks", "ownerId", userId).then(data => {
            if (data) {
                if (data.length === 0) setTaskList("No Tasks");
                data = data.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
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
            {taskList.map((task) =>
                <TaskEntry task={task}/>
            )}
        </div>
    );
}
