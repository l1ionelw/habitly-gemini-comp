import {getAuth, onAuthStateChanged} from "firebase/auth";

export default function checkUserLoggedIn(setUserLoggedIn) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in")
            console.log(user);
            setUserLoggedIn("Logged In");
        } else {
            console.log("User is not logged in");
            setUserLoggedIn("Not Logged In");
        }
    });
}