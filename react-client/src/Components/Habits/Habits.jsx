import {useContext, useEffect, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import getUserData from "../../Utils/getUserData.js";
import Loading from "../Loading.jsx";
import getItemFromFirestore from "../../Utils/getItemFromFirestore.js";
import AddHabit from "./AddHabit.jsx";
import HabitsList from "./HabitsList.jsx";
import {data} from "autoprefixer";

export default function Habits() {
    const [userData, setUserData] = useState(null);
    const userId = useContext(Auth).user.uid;
    useEffect(() => {
        getItemFromFirestore(userId, "users").then(data => {
            console.log("USER DATA");
            console.log(data);
            setUserData(data);
        });
    }, [userId]);


    if (userData) {
        return (
            <div>
                <div className={"text-emerald-600"}>
                    <h1>{userData.name}</h1>
                    <h3>{userData.email}</h3>
                </div>
                <div>
                    <AddHabit/>
                    <HabitsList/>
                </div>
            </div>
        )
    }
    return <Loading/>
}