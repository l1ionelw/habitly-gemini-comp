import {useContext, useMemo, useState} from "react";
import {HabitsListContext} from "../Contexts/HabitsListContext.js";
import {DateTime} from 'luxon';
import updateItemInsideFirestore from "../../Utils/updateItemInsideFirestore.js";
import {produce} from "immer";

export default function CompletedIndicator({habitId}) {
    const habitsList = useContext(HabitsListContext).state;
    const myHabit = habitsList.filter((habit) => habit.id === habitId)[0];
    const [records, setRecords] = useState(myHabit.records);
    const [habitCompleted, setHabitCompleted] = useState(checkHabitCompletedToday());
    console.log(myHabit);
    console.log(records);

    useMemo(() => {
        setHabitCompleted(checkHabitCompletedToday());
    }, [records])

    function checkHabitCompletedToday() {
        console.log(records);
        console.log("MEOW");
        if (!records || records.length === 0) {
            return false;
        }
        const lastTimeCompleted = DateTime.fromMillis(records[0]).startOf("day");
        const now = DateTime.now().startOf("day");

        return lastTimeCompleted.equals(now);
    }

    async function completeHabit() {
        let newState = produce(records, draft => {
            draft.unshift(DateTime.now().ts);
        })
        setRecords(newState);
        console.log(records);
        const toUpdate = {"records": newState};
        console.log(toUpdate);
        await updateItemInsideFirestore("habits", habitId, toUpdate);
        setHabitCompleted(true);
    }

    async function incompleteHabit() {
        let newState = produce(records, draft => {
            draft.splice(0, 1);
        });
        setRecords(newState);
        const toUpdate = {"records": newState};
        console.log(toUpdate);
        await updateItemInsideFirestore("habits", habitId, toUpdate);
        setHabitCompleted(false);
    }

    return (
        <div>
            <p>{habitCompleted ? "Habit is completed" : "Habit not completed"}</p>
            <button onClick={habitCompleted ? incompleteHabit : completeHabit}>{habitCompleted ? "Incomplete Habit" : "Complete Habit"}</button>
        </div>
    )
}