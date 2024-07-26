import React, {useContext, useState} from 'react';
import CompletedCircleIndicator from "../UI/CompletedCircleIndicator.jsx";
import HabitDetailEditor from "../Habits/DetailViewer/HabitDetailEditor.jsx";
import Button from "../UI/Button.jsx";
import DeleteItem from "../DeleteItem.jsx";
import getTaskIndexById from "../Habits/Utils/getTaskIndexById.jsx";
import {produce} from "immer";
import {AppContext} from "../Contexts/AppContext.jsx";
import updateItemInsideFirestore from "../../Utils/updateItemInsideFirestore.js";
import taskSorter from './Utils/taskSorter.js';
import {DateTime} from "luxon";

export default function TaskEntry({task, filterType, filterOrder}) {
    const taskList = useContext(AppContext).getter;
    const setTaskList = useContext(AppContext).setter;
    const [editor, setEditor] = useState(false);

    async function completeTask() {
        const index = getTaskIndexById(taskList, task.id);
        await updateItemInsideFirestore("tasks", task.id, {
            "completed": !task.completed
        })
        let newDraft = produce(taskList, draft => {
            draft[index].completed = !draft[index].completed;
        })
        
        setTaskList(taskSorter(newDraft, filterType, filterOrder));
    }

    function handleTaskDelete() {
        setTaskList(produce((draft) => {
            return draft.filter(item => item.id !== task.id);
        }))
    }

    function updateTask(newTitle, newContent) {
        updateItemInsideFirestore("tasks", task.id, {
            "title": newTitle,
            "content": newContent
        })
        const index = getTaskIndexById(taskList, task.id);
        setTaskList(produce(draft => {
            draft[index].title = newTitle;
            draft[index].content = newContent;
        }))
    }

    return (
        <div className={"flex gap-x-3"}>
            <CompletedCircleIndicator
                onClick={completeTask}
                className={`self-center ${task.completed ? "item-completed" : "item-incomplete"}`}
            />
            {!editor && <div className={"leading-5"}>
                <div className={"leading-4"}>
                <h3>{task.title}</h3>
                <p>{DateTime.fromSeconds(task.createdAt.seconds).toISODate()} | {DateTime.fromSeconds(task.createdAt.seconds).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET)}</p>
                </div>
                <p>{task.content}</p>
            </div>
            }
            {editor && <HabitDetailEditor
                title={task.title}
                missionStatement={task.content}
                setShowEditor={setEditor}
                textBoxWidth={"350px"}
                callback={updateTask}/>}
            <div className={"flex-spacer"}></div>
            <div className={"mr-8 self-center flex gap-x-1"}>
                <Button text={"Edit"} size={12} onClick={() => setEditor(!editor)}/>
                <DeleteItem buttonText={"Delete"} size={12} itemId={task.id} collectionName={"tasks"}
                            callback={handleTaskDelete}/>
            </div>
        </div>
    );
}

