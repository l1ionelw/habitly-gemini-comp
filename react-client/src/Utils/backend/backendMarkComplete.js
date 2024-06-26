import getUserIdToken from "./getUserIdToken.js";
import {API_URL} from "../../main.jsx";

export default async function backendMarkComplete(habitId) {
    let status = "Loading";
    let response = null;
    console.log("sending request to backend server");
    let idToken = await getUserIdToken();
    if (idToken.status === "Error") {
        console.log(idToken.data);
        return
    }
    await fetch(`${API_URL}/api/completehabit/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": idToken.data
        },
        body: JSON.stringify({"habitId": habitId})
    }).then(async e => {
        if (e.status !== 200) {
            status = "Error"
            response = await e.json();
        } else {
            response = e
            status = "Success";
        }
    })

    return {"status": status, "data": response};
}