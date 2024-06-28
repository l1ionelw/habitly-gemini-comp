import {useContext, useState} from "react";
import {HabitsListContext} from "../Contexts/HabitsListContext.js";
import {produce} from "immer";
import backendMarkComplete from "../../Utils/backend/backendMarkComplete.js";
import backendMarkIncomplete from "../../Utils/backend/backendMarkIncomplete.js";
import checkHabitCompleted from "../../Utils/habits/checkHabitCompleted.js";

export default function CompletedIndicator({habitId}) {
    const habitsList = useContext(HabitsListContext).state;
    const setHabits = useContext(HabitsListContext).setter;
    const myHabit = habitsList.filter((habit) => habit.id === habitId)[0];
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
        setHabits(produce(draft => {
            draft[findHabitIndex()].records = newRecords;
        }))
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