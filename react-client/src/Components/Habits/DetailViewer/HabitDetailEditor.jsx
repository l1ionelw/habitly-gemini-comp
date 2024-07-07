import EditValue from "./EditValue.jsx";
import {useState} from "react";
import HabitCard from "../../UI/HabitCard.jsx";
import Button from "../../UI/Button.jsx";

export default function HabitDetailEditor({title, missionStatement, setShowEditor, callback}) {
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [updatedMissionStatement, setUpdatedMissionStatement] = useState(missionStatement);

    function handleSubmit(e) {
        e.preventDefault();
        callback(updatedTitle.trim(), updatedMissionStatement.trim());
        setShowEditor(false);
    }

    // TODO: add max size limits
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input placeholder={updatedTitle}
                       onChange={(e) => setUpdatedTitle(e.target.value)}
                       className={"styled-input bg-transparent"}
                />
                <br/>
                <textarea placeholder={updatedMissionStatement}
                          onChange={(e) => setUpdatedMissionStatement(e.target.value)}
                          className={""}
                />
                <br/> <br/>
                <Button text={"Update"} onClick={handleSubmit} size={13}/>
            </form>
        </div>
    )
}