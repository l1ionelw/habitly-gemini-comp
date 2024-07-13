import React from 'react';
import {getAuth, signOut} from "firebase/auth";

export default function Logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
        window.location.href = "/";
    }).catch((error) => {
        console.log("An error occurred while signing out");
        console.log(error.message);
    });
    return (
        <div>Logging out</div>
    );
}
