async function addItemIntoFirestore(db, collectionName, data) {
    let status = "Loading";
    let response = "";

    await db.collection(collectionName).add(data).then(docRef=>{
        status = "Success";
        response = docRef.id;
    }).catch(e => {
        console.log("An error occurred adding items");
        console.log(e.message);
        status = "Error";
        response = e.message;
    })

    return {"status": status, "data": response};
}

module.exports = addItemIntoFirestore