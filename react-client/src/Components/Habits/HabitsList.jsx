import React, {useContext, useEffect, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";
import ToggleHabitIndicator from "./ToggleHabitIndicator.jsx";
import "../UI/Styles.css"
import HabitCardBase from "../UI/HabitCardBase.jsx";
import checkHabitCompleted from "../../Utils/habits/checkHabitCompleted.js";
import {AppContext} from "../Contexts/AppContext.jsx";
import getHabitIndexById from "./Utils/getHabitIndexById.jsx";
import {produce} from "immer";

export default function HabitsList() {
    const [loading, setLoading] = useState(true);
    const userId = useContext(Auth).user.uid;
    const habitsList = useContext(AppContext).getter;
    const setHabitsList = useContext(AppContext).setter;

    useEffect(() => {
        queryItemFromFirestore("habits", "ownerId", userId).then(data => {
            if (data) {
                if (data.length === 0) {
                    setHabitsList("No Habits");
                } else {
                    setHabitsList(data);
                }
            } else {
                setHabitsList("Error")
            }
            setLoading(false);
        });
    }, []);

    function updateToggledState(newRecords, habitId) {
        const index = getHabitIndexById(habitsList, habitId);
        setHabitsList(produce(draft => {
            draft[index].records = newRecords;
        }))
    }

    function generateHabitClassname(habit) {
        return `habit-hover-animation ${checkHabitCompleted(habit.records) ? "item-completed" : "item-incomplete"}`
    }

    if (habitsList === "No Habits") {
        return <div>You have no habits. </div>
    }
    if (habitsList === "Error") {
        return <div>An unknown error occurred</div>
    }
    if (!loading && habitsList) {
        return (
            <div>
                <br/>
                <h1>My Habits</h1>
                {habitsList.map((habit) => (
                    <div className={"mb-3"}>
                        <div style={{position: "relative"}}>
                            <HabitCardBase
                                className={generateHabitClassname(habit)}>
                                <ToggleHabitIndicator habitId={habit.id} callback={updateToggledState}>
                                    <h4>
                                        <a onClick={(e) => e.stopPropagation()} href={`/habits/detail/${habit.id}`}
                                           className={"unstyled-href"}>{habit.title}</a>
                                    </h4>
                                    <p className={"text-sm"}>{habit.missionStatement}</p>
                                </ToggleHabitIndicator>
                            </HabitCardBase>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    return <Loading/>

}