import EditValue from "./EditValue.jsx";
import {useState} from "react";

export default function HabitDetailEditor({title, missionStatement, callback, variant}) {
    const [showEditor, setShowEditor] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [updatedMissionStatement, setUpdatedMissionStatement] = useState(missionStatement);

    function handleSubmit(e) {
        e.preventDefault();
        callback(updatedTitle.trim(), updatedMissionStatement.trim());
        setShowEditor(false);
    }

    return (
        <div>
            {showEditor ?
                <form onSubmit={handleSubmit}>
                    <input placeholder={updatedTitle}
                           onChange={(e) => setUpdatedTitle(e.target.value)}
                    />
                    <br/>
                    <input placeholder={updatedMissionStatement}
                           onChange={(e) => setUpdatedMissionStatement(e.target.value)}
                    />
                    <br/>
                    <input type={"submit"} value={"Update"}/>
                </form> :
                <div>
                    <p><strong>{title}</strong></p>
                    <p>{missionStatement}</p>
                </div>
            }
            {variant !== "NoEdit" ? <EditValue setShowEditor={setShowEditor}/> : ""}
        </div>
    )
}