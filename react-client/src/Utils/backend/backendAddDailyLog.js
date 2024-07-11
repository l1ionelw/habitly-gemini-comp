import getUserIdToken from "./getUserIdToken.js";
import {API_URL} from "../../main.jsx";

export default async function backendAddDailyLog(title, content) {
    let status = "Loading";
    let response = null;

    let idToken = await getUserIdToken();
    if (idToken.status === "Error") {
        console.log(idToken.data);
        return
    }
    await fetch(`${API_URL}/api/dailylog/add/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": idToken.data
        },
        body: JSON.stringify({"title": title, "content": content})
    }).then(async resp => {
        if (resp.status !== 200) {
            status = "Error"
        } else {
            status = "Success";
        }
        await resp.json().then((json) => response = json);
    }).catch(e => {
        console.log(e.message);
        response = e.message;
        status = "Error";
    })
    return {"status": status, "data": response}
}