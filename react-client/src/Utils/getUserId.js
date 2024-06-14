// gets the user id of the currently logged in user, or null if no user is logged in
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default function getUserId(setUid) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUid(user.uid);
        }
    });
}