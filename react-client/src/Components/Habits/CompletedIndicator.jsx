import {useState} from "react";
import {produce} from "immer";
import backendMarkComplete from "../../Utils/backend/backendMarkComplete.js";
import backendMarkIncomplete from "../../Utils/backend/backendMarkIncomplete.js";
import checkHabitCompleted from "../../Utils/habits/checkHabitCompleted.js";
import getHabitIndexById from "./Utils/getHabitIndexById.jsx";

export default function CompletedIndicator({children, habitId, variant, habitsList, setHabits}) {
    const myHabit = variant === "HabitDetail" ? habitsList : habitsList.filter((habit) => habit.id === habitId)[0];
    const records = myHabit.records;
    const [habitCompleted, setHabitCompleted] = useState(checkHabitCompleted(records));

    async function updateNewState(functionCallback) {
        let newRecords;
        await functionCallback(habitId).then(async e => {
            console.log(e);
            newRecords = await e.data.json().then(e => newRecords = e.data);
        })
        console.log(newRecords);
        if (variant === "HabitDetail") {
            setHabits(produce(draft => {
                draft.records = newRecords
            }))
        } else {
            const index = getHabitIndexById(habitsList, habitId);
            setHabits(produce(draft => {
                draft[index].records = newRecords;
            }))
        }
        setHabitCompleted(produce(draft => !draft))
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