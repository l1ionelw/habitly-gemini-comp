import {getAuth, getIdToken} from "firebase/auth";
const auth = getAuth();

export default async function getUserIdToken() {
    const {currentUser} = auth
    let status = "Loading";
    let data = null;
    await getIdToken(currentUser).then(idToken => {
        status = "Success";
        data = idToken;
    }).catch(err => {
        status = "Error";
        data = err.message;
    })
    return {"status": status, "data": data};

}