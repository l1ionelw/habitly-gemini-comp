import {useContext, useState} from "react";
import {produce} from "immer";
import backendMarkComplete from "../../Utils/backend/backendMarkComplete.js";
import backendMarkIncomplete from "../../Utils/backend/backendMarkIncomplete.js";
import checkHabitCompleted from "../../Utils/habits/checkHabitCompleted.js";

export default function CompletedIndicator({habitId, variant, habitsList, setHabits}) {
    const myHabit = variant === "HabitDetail" ? habitsList : habitsList.filter((habit) => habit.id === habitId)[0];
    const records = myHabit.records;
    const [habitCompleted, setHabitCompleted] = useState(checkHabitCompleted(records));

    function findHabitIndex() {
        for (let i in habitsList) {
            if (habitsList[i].id === habitId) {
                return i;
            }
        }
    }

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
            setHabits(produce(draft => {
                draft[findHabitIndex()].records = newRecords;
            }))
        }
        setHabitCompleted(produce(draft => !draft))
    }


    async function toggleHabit() {
        await updateNewState(habitCompleted ? backendMarkIncomplete : backendMarkComplete);
    }

    return (
        <div>
            <p>{habitCompleted ? "Habit is completed" : "Habit not completed"}</p>
            <button
                onClick={toggleHabit}>{habitCompleted ? "Incomplete Habit" : "Complete Habit"}</button>
        </div>
    )
}