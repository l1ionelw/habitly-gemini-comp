import deleteItemFromFirestore from "../../Utils/deleteItemFromFirestore.js";

export default function DeleteHabit({documentId}) {
    function showDeleteConfirmation() {
        if (confirm("Are you sure? This action cannot be undone! ")) {
            handleDelete();
        }
    }

    function handleDelete() {
        console.log("deleting habit: ", documentId);
        deleteItemFromFirestore("habits", documentId);
    }

    return (
        <div>
            <button onClick={showDeleteConfirmation}>Delete Habit</button>
        </div>
    )
}