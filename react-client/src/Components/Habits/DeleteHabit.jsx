import deleteItemFromFirestore from "../../Utils/deleteItemFromFirestore.js";
import {produce} from "immer";
import {useContext} from "react";
import {HabitsListContext} from "../Contexts/HabitsListContext.js";

export default function DeleteHabit({documentId, variant, onClick}) {
    const stateManager = useContext(HabitsListContext);
    function showDeleteConfirmation() {
        if (confirm("Are you sure? This action cannot be undone! ")) {
            handleDelete();
            onClick ? onClick(): true;
        }
    }

    function handleDelete() {
        if (!documentId) {
            console.log("document doesn't have a valid id, please refresh and try again");
            location.reload();
            return
        }
        console.log("deleting habit: ", documentId);
        deleteItemFromFirestore("habits", documentId);
        if (variant === "HabitsList") {
            updateStateList();
        }
    }

    function updateStateList() {
        stateManager.setter(produce(draft => {
            return draft.filter((habit) => habit.id !== documentId);
        }))
    }

    return (
        <div>
            <button onClick={showDeleteConfirmation}>Delete Habit</button>
        </div>
    )
}