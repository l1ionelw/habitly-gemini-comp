import getUserIdToken from "./getUserIdToken.js";
import {API_URL} from "../../main.jsx";

export default async function backendDeleteLogs(habitId) {
    let status = "Loading";
    let response = null;
    console.log("sending request to backend server");
    let idToken = await getUserIdToken();
    if (idToken.status === "Error") {
        console.log(idToken.data);
        return
    }
    await fetch(`${API_URL}/api/logs/delete/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": idToken.data
        },
        body: JSON.stringify({"habitId": habitId})
    }).then(async e => {
        status = e.status === 200 ? "Success" : "Error";
        response = await e.json();
    }).catch(e=>{
        status = "Error"
        response = e.message;
    })
    return {"status": status, "data": response}
}