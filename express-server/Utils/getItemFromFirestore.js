async function getItemFromFirestore(db, itemId, collectionName) {
    let status = "Loading";
    let data;
    let error;

    const docRef = db.collection(collectionName).doc(itemId);
    await docRef.get().then(docSnap => {
        if (docSnap) {
            data = docSnap.data();
            status = "Success";
        } else {
            console.log("Can't find document");
            status = "Error";
            error = "An error occurred while getting data: Can't find document";
        }
    }).catch(e => {
        console.log("Error fetching data");
        console.log(e.message);
        status = "Error";
        error = `An error occurred while getting data: ${e.message}`;
    });

    return {"status": status, "data": status === "Success" ? data : error};
}
module.exports = getItemFromFirestore;