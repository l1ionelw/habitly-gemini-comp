import {getAuth, getIdToken} from "firebase/auth";
const auth = getAuth();

export default async function getUserIdToken() {
    if (import.meta.env.VITE_FIRESTORE_EMULATOR) {
        return {"status": "Success", "data": "hi"}
    }

    const {currentUser} = auth
    let status = "Loading";
    let data = null;
    try {
        await getIdToken(currentUser).then(idToken => {
            status = "Success";
            data = idToken;
        }).catch(err => {
            status = "Error";
            data = err.message;
        })
    }
    catch (exception) {
        console.log(exception);
        status = "Error"
        data = exception.message
    }

    return {"status": status, "data": data};

}