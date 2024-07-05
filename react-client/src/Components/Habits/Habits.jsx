import {useContext, useMemo, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import getItemFromFirestore from "../../Utils/getItemFromFirestore.js";
import AddHabit from "./AddHabit.jsx";
import HabitsList from "./HabitsList.jsx";
import {HabitsListContext} from "../Contexts/HabitsListContext.jsx";
import Button from "../UI/Button.jsx";

export default function Habits() {
    const [userData, setUserData] = useState(null);
    const userId = useContext(Auth).user.uid;
    const [habitsList, setHabitsList] = useState();
    const [showEditor, setShowEditor] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    useMemo(() => {
        getItemFromFirestore(userId, "users").then(data => {
            setUserData(data.data);
        });
    }, [userId]);


    if (userData) {
        return (
            <div className={`pt-5`}>
                <Button text={"Add Habit"} size={15} onClick={() => setShowEditor(!showEditor)}/>
                <div hidden={errorMessage === ""}>{errorMessage}</div>
                <div className={"text-emerald-600"}>
                    <h1>{userData.name}</h1>
                    <h3>{userData.email}</h3>
                </div>
                <div>
                    <HabitsListContext.Provider value={{state: habitsList, setter: setHabitsList}}>
                        <div className={`${showEditor ? "nofocus" : ""}`}>
                            <HabitsList/>
                        </div>
                        <AddHabit showEditor={showEditor} setErrorMessage={setErrorMessage} callback={() => setShowEditor(false)}/>
                    </HabitsListContext.Provider>
                </div>
            </div>
        )
    }
    return <Loading/>
}