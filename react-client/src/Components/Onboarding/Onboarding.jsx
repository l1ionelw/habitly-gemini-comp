import handleGoogle from "../GoogleAuth/GoogleAuth.jsx";
import {useState} from "react";
import checkUserLoggedIn from "../GoogleAuth/checkUserLoggedIn.jsx";
import Redirect from "../Redirect.jsx";

export default function Onboarding() {

    return (
        <div onClick={handleGoogle}>
            Login with google
        </div>
    )
}