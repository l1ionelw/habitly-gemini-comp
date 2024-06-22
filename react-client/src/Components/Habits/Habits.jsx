import {useContext, useMemo, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import getItemFromFirestore from "../../Utils/getItemFromFirestore.js";
import AddHabit from "./AddHabit.jsx";
import HabitsList from "./HabitsList.jsx";
import {HabitsListContext} from "../Contexts/HabitsListContext.js";

export default function Habits() {
    const [userData, setUserData] = useState(null);
    const userId = useContext(Auth).user.uid;
    const [habitsList, setHabitsList] = useState();


    useMemo(() => {
        getItemFromFirestore(userId, "users").then(data => {
            setUserData(data.data);
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
                    <HabitsListContext.Provider value={{state: habitsList, setter: setHabitsList}}>
                        <AddHabit/>
                        <HabitsList/>
                    </HabitsListContext.Provider>
                </div>
            </div>
        )
    }
    return <Loading/>
}