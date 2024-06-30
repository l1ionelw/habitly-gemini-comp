async function deleteItemFromFirestore(db, collectionName, documentId) {
    let status = "Loading";
    let response = "";

    await db.collection(collectionName).doc(documentId).delete().then(() => {
        status = "Success";
    }).catch((error) => {
        status = "Error";
        response = error.message;
    });
    return {"status": status, "data": response}
}

module.exports = deleteItemFromFirestore;