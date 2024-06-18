import React, {useContext, useEffect, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import queryItemFromFirestore from "../../Utils/queryItemFromFirestore.js";

export default function HabitsList() {
    const userId = useContext(Auth).user.uid;
    const [habitsList, setHabitsList] = useState(null);
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
                {habitsList.map((habit) => {
                    return <div>
                        <h3>{habit.title}</h3>
                        <p>{JSON.stringify(habit)}</p>
                    </div>
                })}
            </div>
        )
    }
    return <Loading/>

}