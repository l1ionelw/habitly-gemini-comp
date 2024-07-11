import deleteDataFromFirestore from "../Utils/deleteItemFromFirestore.js";
import Button from "./UI/Button.jsx";

export default function DeleteItem({buttonText, size, itemId, collectionName, callback}) {
    function showDeleteConfirmation() {
        if (confirm("Are you sure you want to delete this item? This action cannot be undone. ")) {
            handleDelete();
        }
    }

    async function handleDelete() {
        await deleteDataFromFirestore(collectionName, itemId).then(e => {
            console.log(e);
        });
        callback ? callback(itemId) : "";
    }

    return (
        <div>
            <Button text={buttonText} size={size} onClick={showDeleteConfirmation}></Button>
        </div>
    )
}