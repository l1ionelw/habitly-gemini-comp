import { getAuth } from "firebase/auth";


export default function checkUserLoggedIn(setUserLoginState) {
    const auth = getAuth();
    auth.onAuthStateChanged(function(user) {
        if (user) {
            setUserLoginState(user);
        } else {
            setUserLoginState("Not Logged In");
        }
    });
}