import React, {useContext, useEffect, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import DeleteHabit from "./DeleteHabit.jsx";
import CompletedIndicator from "./CompletedIndicator.jsx";
import {HabitsListContext} from "../Contexts/HabitsListContext.jsx";

export default function HabitsList() {
    const userId = useContext(Auth).user.uid;
    const habitsList = useContext(HabitsListContext).state;
    const setHabitsList = useContext(HabitsListContext).setter;
    useEffect(() => {
        queryItemFromFirestore("habits", "ownerId", userId).then(data => {
            if (data) {
                setHabitsList(data);
            } else {
                setHabitsList("No Habits");
            }
        });
    }, [])

    if (habitsList === "No Habits") {
        return <div>You have no habits. </div>
    }
    if (habitsList) {
        return (
            <div>
                <br/>
                <h1>My Habits</h1>
                {habitsList.map((habit) => {
                    console.log(habit.id)
                    return <div>
                        <h3><a href={`/habits/detail/${habit.id}`}>{habit.title}</a></h3>
                        <p>{JSON.stringify(habit)}</p>
                        <CompletedIndicator habitId={habit.id} habitsList={habitsList} setHabits={setHabitsList}/>
                        <DeleteHabit habitId={habit.id} />
                    </div>
                })}
            </div>
        )
    }
    return <Loading/>

}