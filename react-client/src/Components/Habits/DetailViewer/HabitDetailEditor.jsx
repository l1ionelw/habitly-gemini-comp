import EditValue from "./EditValue.jsx";
import {useState} from "react";
import HabitCard from "../../UI/HabitCard.jsx";

export default function HabitDetailEditor({title, missionStatement, showEditor, setShowEditor, callback}) {
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [updatedMissionStatement, setUpdatedMissionStatement] = useState(missionStatement);

    function handleSubmit(e) {
        e.preventDefault();
        callback(updatedTitle.trim(), updatedMissionStatement.trim());
        setShowEditor(false);
    }


    return (
        <div>
            <HabitCard>
            <form onSubmit={handleSubmit}>
                <input placeholder={updatedTitle}
                       onChange={(e) => setUpdatedTitle(e.target.value)}
                       className={"styled-input"}
                />
                <br/>
                <textarea placeholder={updatedMissionStatement}
                       onChange={(e) => setUpdatedMissionStatement(e.target.value)}
                />
                <br/>
                <input type={"submit"} value={"Update"}/>
            </form>
            </HabitCard>
        </div>
    )
}