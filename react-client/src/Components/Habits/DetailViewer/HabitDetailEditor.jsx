import EditValue from "./EditValue.jsx";
import {useState} from "react";
import {produce} from "immer";
import updateItemInsideFirestore from "../../../Utils/updateItemInsideFirestore.js";

export default function HabitDetailEditor({habitInfo, setHabitInfo}) {
    const [showEditor, setShowEditor] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(habitInfo ? habitInfo.title : "");
    const [updatedMissionStatement, setUpdatedMissionStatement] = useState(habitInfo ? habitInfo.missionStatement : "");

    function updateHabitDetails(e) {
        e.preventDefault();
        setUpdatedTitle(produce(draft => draft.trim()));
        setUpdatedMissionStatement(produce(draft => draft.trim()));
        updateItemInsideFirestore("habits", habitInfo.id, {
            "title": updatedTitle,
            "missionStatement": updatedMissionStatement
        }).then((e) => {
            console.log(e);
            setShowEditor(false);
            setHabitInfo(produce(draft => {
                draft.title = updatedTitle;
                draft.missionStatement = updatedMissionStatement;
            }))
        })
    }

    return (
        <div>
            {showEditor ?
                <form onSubmit={updateHabitDetails}>
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
                    <p><strong>Habit Name: </strong>{habitInfo.title}</p>
                    <p><strong>Mission Statement: </strong>{habitInfo.missionStatement}</p>
                </div>
            }

            <EditValue setShowEditor={setShowEditor}/>
        </div>
    )
}