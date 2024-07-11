import {useState} from "react";
import Button from "../../UI/Button.jsx";

export default function HabitDetailEditor({itemId, title, missionStatement, setShowEditor, width, callback}) {
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [updatedMissionStatement, setUpdatedMissionStatement] = useState(missionStatement);

    function handleSubmit(e) {
        e.preventDefault();
        callback(updatedTitle.trim(), updatedMissionStatement.trim(), itemId);
        setShowEditor(false);
    }

    // TODO: add max size limits
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input placeholder={updatedTitle}
                       onChange={(e) => setUpdatedTitle(e.target.value)}
                       className={"styled-input bg-transparent"}
                       style={{width: width}}
                />
                <br/>
                <textarea placeholder={updatedMissionStatement}
                          onChange={(e) => setUpdatedMissionStatement(e.target.value)}
                          className={""}
                          style={{width: width}}
                />
                <br/> <br/>
                <Button text={"Update"} onClick={handleSubmit} size={13} className={"bg-teal-400"}/>
            </form>
        </div>
    )
}