import deleteDataFromFirestore from "../Utils/deleteItemFromFirestore.js";
import Button from "./UI/Button.jsx";

export default function DeleteItem({buttonText, itemId, collectionName, callback}) {
    function showDeleteConfirmation() {
        if (confirm("Are you sure you want to delete this item? This action cannot be undone. ")) {
            handleDelete();
        }
    }

    async function handleDelete() {
        console.log("handling delete: ", itemId);
        await deleteDataFromFirestore(collectionName, itemId).then(e => {
            console.log(e);
        });
        callback ? callback() : "";
    }

    return (
        <div>
            <Button text={buttonText} onClick={showDeleteConfirmation}></Button>
        </div>
    )
}