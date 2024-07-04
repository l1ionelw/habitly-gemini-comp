import React, {useContext, useEffect, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import DeleteHabit from "./DeleteHabit.jsx";
import CompletedIndicator from "./CompletedIndicator.jsx";
import {HabitsListContext} from "../Contexts/HabitsListContext.jsx";
import {produce} from "immer";
import HabitCard from "../UI/HabitCard.jsx";

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

    function updateHabitListAfterDelete(id) {
        console.log("deleting")
        setHabitsList(produce((draft) => draft.filter((item) => item.id !== id)
        ));
    }

    if (habitsList) {
        return (
            <div>
                <br/>
                <h1>My Habits</h1>
                {habitsList.map((habit) => {
                    console.log(habit.id)
                    return <div>
                        <a href={`/habits/detail/${habit.id}`} className={"unstyled-href"}>
                            <HabitCard>
                                <h4>{habit.title}</h4>
                                <p>{habit.missionStatement}</p>
                            </HabitCard>
                        </a>

                        <CompletedIndicator habitId={habit.id} habitsList={habitsList} setHabits={setHabitsList}/>
                        <DeleteHabit habitId={habit.id} callback={() => updateHabitListAfterDelete(habit.id)}/>
                    </div>
                })}
            </div>
        )
    }
    return <Loading/>

}