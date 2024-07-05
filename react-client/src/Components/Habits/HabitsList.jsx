import React, {useContext, useEffect} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import CompletedIndicator from "./CompletedIndicator.jsx";
import {HabitsListContext} from "../Contexts/HabitsListContext.jsx";
import HabitCard from "../UI/HabitCard.jsx";
import checkHabitCompleted from "../../Utils/habits/checkHabitCompleted.js";

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
    }, []);


    if (habitsList === "No Habits") {
        return <div>You have no habits. </div>
    }

    const generateHabitClassname = (habit) => `habit-hover-animation ${checkHabitCompleted(habit.records) ? "habit-completed" : "habit-incomplete"}`

    if (habitsList) {
        return (
            <div>
                <br/>
                <h1>My Habits</h1>
                {habitsList.map((habit) => {
                    console.log(habit.id)
                    return (
                        <div className={"mb-3"}>
                            <CompletedIndicator habitId={habit.id} habitsList={habitsList} setHabits={setHabitsList}>
                                <HabitCard
                                    className={generateHabitClassname(habit)}>
                                    <h4>
                                        <a href={`/habits/detail/${habit.id}`}
                                           className={"unstyled-href"}>{habit.title}</a>
                                    </h4>
                                    <p className={"text-sm"}>{habit.missionStatement}</p>
                                </HabitCard>
                            </CompletedIndicator>
                        </div>
                    )
                })}
            </div>
        )
    }
    return <Loading/>

}