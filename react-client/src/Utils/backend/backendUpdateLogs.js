import getUserIdToken from "./getUserIdToken.js";
import {API_URL} from "../../main.jsx";

export default async function backendUpdateLogs(logId, title, content, habitId) {
    let status = "Loading";
    let response = null;
    console.log("sending request to backend server");
    let idToken = await getUserIdToken();
    if (idToken.status === "Error") {
        console.log(idToken.data);
        return
    }
    await fetch(`${API_URL}/api/logs/update/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": idToken.data
        },
        body: JSON.stringify({"logId": logId, "title": title, "content": content, "habitId": habitId})
    }).then(async e => {
        console.log(e);
        e.status === 200 ? status = "Success" : status = "Error";
        response = await e.json();
    }).catch(e => {
        console.log(e);
        status = "Error";
        response = e.message;
    })
    return {"status": status, "data": response};
}