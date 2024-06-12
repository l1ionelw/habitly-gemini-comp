import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../../firebase.js";

export default async function handleGoogle(e) {

    console.log("handling google");
    const provider = await new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            console.log(token);
            const user = result.user;
            const displayName = user.displayName;
            const email = user.email;
            console.log(displayName + " " + email);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("An error occurred");
            console.log(errorCode);
            console.log(errorMessage);
        });
}