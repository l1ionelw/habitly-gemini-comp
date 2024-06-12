import { getAuth, signOut } from "firebase/auth";

export default function Logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
        console.log("Sign out successful");
    }).catch((error) => {
        console.log("An error occurred");
        console.log(error.toString());
    });
}