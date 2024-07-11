import React, {useContext, useEffect, useState} from 'react';
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import {Auth} from "../Contexts/AuthContext.jsx";
import DeleteItem from "../DeleteItem.jsx";
import {produce} from "immer";
import CompletedCircleIndicator from "../UI/CompletedCircleIndicator.jsx";
import TaskEntry from "../UI/TaskEntry.jsx";
import getTaskIndexById from "../Habits/Utils/getTaskIndexById.jsx";
import Button from "../UI/Button.jsx";
import HabitDetailEditor from "../Habits/DetailViewer/HabitDetailEditor.jsx";
import updateItemInsideFirestore from "../../Utils/updateItemInsideFirestore.js";

export default function TasksList({taskList, setTaskList}) {
    const userId = useContext(Auth).user.uid;
    const [editor, setEditor] = useState(false);
    useEffect(() => {
        queryItemFromFirestore("tasks", "ownerId", userId).then(data => {
            if (data) {
                if (data.length === 0) setTaskList("No Tasks");
                console.log(data);
                data = data.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
                setTaskList(data);
            } else {
                setTaskList("Error");
            }
        });
    }, []);

    function completeTask(itemId) {
        console.log("completing task", itemId);
        const index = getTaskIndexById(taskList, itemId);
        setTaskList(produce((draft) => {
                draft[index].completed = !draft[index].completed;
            }
        ))
    }

    function handleTaskDelete(taskId) {
        console.log('Handling delete', taskId);
        setTaskList(produce((draft) => {
            return draft.filter(item => item.id !== taskId);
        }))
    }

    function updateTask(newTitle, newContent, taskId) {
        updateItemInsideFirestore("tasks", taskId, {
            "title": newTitle,
            "content": newContent
        }).then((e) => {
            console.log(e);
            const index = getTaskIndexById(taskList, taskId);
            setTaskList(produce(draft => {
                draft[index].title = newTitle;
                draft[index].content = newContent;
            }))
        })
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
                <TaskEntry>
                    <CompletedCircleIndicator onClick={completeTask} taskId={task.id}
                                              className={`self-center ${task.completed ? "item-completed" : "item-incomplete"}`}
                    />
                    {!editor && <div className={"leading-5"}>
                        <h3>{task.title}</h3>
                        <p>{task.content}</p>
                    </div>}
                    {editor && <HabitDetailEditor title={task.title} missionStatement={task.content} itemId={task.id}
                                                  setShowEditor={setEditor} width={"200px"} callback={updateTask}/>}
                    <div className={"mr-8 self-center flex gap-x-1"}>
                        <Button text={"Edit"} size={12} onClick={() => setEditor(!editor)}/>
                        <DeleteItem buttonText={"Delete"} size={12} itemId={task.id} collectionName={"tasks"}
                                    callback={handleTaskDelete} />
                    </div>
                </TaskEntry>
            )}
        </div>
    );
}
