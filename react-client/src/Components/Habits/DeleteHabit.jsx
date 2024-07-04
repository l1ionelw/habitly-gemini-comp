import deleteDataFromFirestore from "../../Utils/deleteItemFromFirestore.js";

export default function DeleteHabit({habitId, callback}) {
    function showDeleteConfirmation() {
        if (confirm("Are you sure you want to delete this entry? This action cannot be undone. ")) {
            handleDelete();
        }
    }

    async function handleDelete() {
        console.log("handling delete: ", habitId);
        await deleteDataFromFirestore("habits", habitId).then(e => {
            console.log(e);
        });
        callback();
    }

    return (
        <div>
            <button onClick={showDeleteConfirmation}>Delete Habit</button>
        </div>
    )
}