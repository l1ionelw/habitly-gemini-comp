import getUserIdToken from "./getUserIdToken.js";
import {API_URL} from "../../main.jsx";

export default async function backendMarkIncomplete(habitId) {
    let status = "Loading";
    let response = null;
    console.log("sending request to backend server");
    let idToken = await getUserIdToken();
    if (idToken.status === "Error") {
        console.log(idToken.data);
        return
    }
    console.log(idToken.data);
    await fetch(`${API_URL}/api/incomplete/`, {
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