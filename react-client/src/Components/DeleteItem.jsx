import deleteDataFromFirestore from "../Utils/deleteItemFromFirestore.js";
import Button from "./UI/Button.jsx";
import backendDeleteHabit from "../Utils/backend/backendDeleteHabit.js";

export default function DeleteItem({buttonText, size, itemId, collectionName, variant, callback}) {
    async function showDeleteConfirmation() {
        if (confirm("Are you sure you want to delete this item? This action cannot be undone. ")) {
            await handleDelete().then(() => {
                callback ? callback() : "";
            });
        }
    }

    async function handleDelete() {
        if (variant === "Habits") {
            return await backendDeleteHabit(itemId).then((resp) => {
                console.log(resp);
            })
        } else {
            return await deleteDataFromFirestore(collectionName, itemId).then(e => {
                console.log(e);
            });
        }
    }

    return (
        <div>
            <Button text={buttonText} size={size} onClick={async () => await showDeleteConfirmation()}></Button>
        </div>
    )
}