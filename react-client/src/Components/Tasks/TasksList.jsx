import React, {useContext, useEffect} from 'react';
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import DeleteItem from "../DeleteItem.jsx";

export default function TasksList({taskList, setTaskList}) {
    const userId = useContext(Auth).user.uid;
    useEffect(() => {
        queryItemFromFirestore("tasks", "ownerId", userId).then(data => {
            if (data) {
                console.log(data);
                setTaskList(data);
                if (data.length === 0) setTaskList("No Tasks");

            } else {
                setTaskList("Error")
            }
        });
    }, []);


    if (taskList === "No Tasks") {
        return <div>You have no habits. </div>
    }
    if (taskList === "Error") {
        return <div>An unknown error occurred</div>
    }
    return (
        <div>
            {taskList.map((task) =>
                <div>
                    <h3>{task.title}</h3>
                    <p>{task.content}</p>
                    <DeleteItem buttonText={"Delete"} itemId={task.id} collectionName={"tasks"} />
                </div>
            )}
        </div>
    );
}
