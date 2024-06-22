import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import getItemFromFirestore from "../../Utils/getItemFromFirestore.js";

export default function DetailView() {
    const habitId = useParams().habitId;
    const [habitInfo, setHabitInfo] = useState();
    const [error, setError] = useState("");
    console.log(habitId);

    useEffect(() => {
        getItemFromFirestore(habitId, "habits").then(resp => {
            console.log(resp);
            if (resp.status === "Success") {
                setHabitInfo(resp.data);
            } else if (resp.status === "Error") {
                setError(resp.data);
            } else {
                setError("An unknown error occurred");
            }
        });
    }, [])

    if (habitInfo) {
        return (
            <div>
                Detail viewer
                <p>{JSON.stringify(habitInfo)}</p>
            </div>
        )
    }
    return <div>{error}</div>

}