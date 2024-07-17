import {useState} from "react";
import Button from "../../UI/Button.jsx";

export default function HabitDetailEditor({title, missionStatement, setShowEditor, textBoxWidth, callback}) {
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
                       style={{width: textBoxWidth}}
                />
                <br/>
                <textarea placeholder={updatedMissionStatement}
                          onChange={(e) => setUpdatedMissionStatement(e.target.value)}
                          className={"border-none resize-none bg-transparent"}
                          style={{width: textBoxWidth, padding: "0.1rem 0.5rem", height: "40px"}}
                />
                <br/>
                <Button text={"Update"} onClick={handleSubmit} size={13} className={"bg-teal-400"}/>
            </form>
        </div>
    )
}