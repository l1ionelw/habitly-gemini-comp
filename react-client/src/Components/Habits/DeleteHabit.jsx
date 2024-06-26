import deleteDataFromFirestore from "../../Utils/deleteItemFromFirestore.js";

export default function DeleteHabit({habitName}) {
    function showDeleteConfirmation() {
        if (confirm("Are you sure you want to delete this entry? This action cannot be undone. ")) {
            handleDelete();
        }
    }

    function handleDelete() {
        console.log("handling delete: ", habitName);
        deleteDataFromFirestore("habits", habitName);
    }

    return (<div>
        <button onClick={showDeleteConfirmation}>Delete Habit</button>
    </div>)
}