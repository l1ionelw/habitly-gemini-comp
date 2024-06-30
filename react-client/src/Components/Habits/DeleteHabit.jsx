import deleteDataFromFirestore from "../../Utils/deleteItemFromFirestore.js";

export default function DeleteHabit({habitName}) {
    function showDeleteConfirmation() {
        if (confirm("Are you sure you want to delete this entry? This action cannot be undone. ")) {
            handleDelete();
        }
    }

    async function handleDelete() {
        console.log("handling delete: ", habitName);
        await deleteDataFromFirestore("habits", habitName).then(e => {
            console.log(e);
        });
    }

    return (<div>
        <button onClick={showDeleteConfirmation}>Delete Habit</button>
    </div>)
}