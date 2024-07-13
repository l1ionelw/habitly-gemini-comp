import {useContext, useState} from "react";
import {produce} from "immer";
import backendMarkComplete from "../../Utils/backend/backendMarkComplete.js";
import backendMarkIncomplete from "../../Utils/backend/backendMarkIncomplete.js";
import checkHabitCompleted from "../../Utils/habits/checkHabitCompleted.js";
import {AppContext} from "../Contexts/AppContext.jsx";

export default function ToggleHabitIndicator({children, habitId, callback, variant}) {
    const habitsList = useContext(AppContext).getter;
    const myHabit = variant === "HabitDetail" ? habitsList : habitsList.filter((habit) => habit.id === habitId)[0];
    const records = myHabit.records;
    const [habitCompleted, setHabitCompleted] = useState(() => checkHabitCompleted(records));

    async function updateNewState(functionCallback) {
        let newRecords;
        await functionCallback(habitId).then(async e => {
            console.log(e);
            newRecords = await e.data.json().then(e => newRecords = e.data);
        })
        callback(newRecords, habitId);
        setHabitCompleted(produce(draft => !draft));
    }

    async function toggleHabit() {
        await updateNewState(habitCompleted ? backendMarkIncomplete : backendMarkComplete);
    }

    return (
        <div onClick={toggleHabit} className={"cursor-pointer"}>
            {children}
        </div>
    )
}