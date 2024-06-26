async function updateItemInsideFirestore(db, collectionName, docId, data) {
    let status = "Loading";
    let response = null;
    console.log("updating document");

    const updateRef = db.collection(collectionName).doc(docId);
    await updateRef.update(data).then(e => {
        status = "Success";
    }).catch(e=>{
        status = "Error";
        response = e.message
    })
    return {"status": status, "data": response}
}

module.exports = updateItemInsideFirestore