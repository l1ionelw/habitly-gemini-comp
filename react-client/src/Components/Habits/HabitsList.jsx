import React, {useContext, useEffect} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import DeleteHabit from "./DeleteHabit.jsx";
import CompletedIndicator from "./CompletedIndicator.jsx";
import {HabitsListContext} from "../Contexts/HabitsListContext.js";

export default function HabitsList() {
    const userId = useContext(Auth).user.uid;
    const habitsList = useContext(HabitsListContext).state;
    const setHabitsList = useContext(HabitsListContext).setter;
    useEffect(() => {
        queryItemFromFirestore("habits", "ownerId", userId).then(data => {
            if (data) {
                console.log(data);
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
                <h2>My Habits</h2>
                {habitsList.map((habit) => {
                    return <div>
                        <h3><a href={`/habits/detail/${habit.id}`}>{habit.title}</a></h3>
                        <p>{JSON.stringify(habit)}</p>
                        <CompletedIndicator habitsList={habitsList} habitId={habit.id} />
                        <DeleteHabit documentId={habit.id} variant={"HabitsList"} />
                    </div>
                })}
            </div>
        )
    }
    return <Loading/>

}