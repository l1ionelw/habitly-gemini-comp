import React, {useState} from 'react';
import TasksList from "./TasksList.jsx";
import AddTask from "./AddTask.jsx";
import Button from "../UI/Button.jsx";
import ContentBlurred from "../UI/ContentBlurred.jsx";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [showEditor, setEditor] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    return (
        <div>
            <ContentBlurred showEditor={showEditor}>
                <Button text={"Add Task"} size={15} onClick={() => setEditor(!showEditor)}/>
                <p>{errorMessage}</p>
                <h1>Tasks</h1>
                <TasksList taskList={tasks} setTaskList={setTasks}/>
            </ContentBlurred>
            <AddTask showEditor={showEditor} setErrorMessage={setErrorMessage} callback={()=>setEditor(false)}/>

        </div>
    );
}
