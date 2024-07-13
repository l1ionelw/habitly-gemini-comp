import {useContext, useMemo, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import Loading from "../Loading.jsx";
import getItemFromFirestore from "../../Utils/getItemFromFirestore.js";
import NewItemCard from "./NewItemCard.jsx";
import HabitsList from "./HabitsList.jsx";
import Button from "../UI/Button.jsx";
import ContentBlurred from "../UI/ContentBlurred.jsx";
import {AppContext} from "../Contexts/AppContext.jsx";
import {produce} from "immer";

export default function Habits() {
    const [userData, setUserData] = useState(null);
    const userId = useContext(Auth).user.uid;
    const setHabitsList = useContext(AppContext).setter;
    const [showEditor, setShowEditor] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    useMemo(() => {
        getItemFromFirestore(userId, "users").then(data => {
            setUserData(data.data);
        });
    }, [userId]);

    function addNewItemToState(data) {
        if (!data) return;
        setHabitsList(produce(draft => {
            draft.unshift(data);
        }))
        setShowEditor(false);
    }


    if (userData) {
        return (
            <div className={`pt-5`}>
                <ContentBlurred showEditor={showEditor}>
                    <Button text={"Add Habit"} size={15} onClick={() => setShowEditor(!showEditor)}/>
                    <div hidden={errorMessage === ""}>{errorMessage}</div>
                    <div className={"text-emerald-600"}>
                        <h1>{userData.name}</h1>
                        <h3>{userData.email}</h3>
                    </div>
                    <HabitsList/>
                </ContentBlurred>
                <NewItemCard showEditor={showEditor} setErrorMessage={setErrorMessage}
                             callback={addNewItemToState}/>
            </div>

        )
    }
    return <Loading/>
}