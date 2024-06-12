import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useState} from "react";

export default function checkUserLoggedIn() {
    const [loggedIn, setLoggedIn] = useState(null);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("user is logged in");
            console.log(user);
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    });
    return loggedIn;
}