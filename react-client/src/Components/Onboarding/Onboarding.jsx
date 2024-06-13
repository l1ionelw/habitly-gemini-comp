import handleGoogle from "../GoogleAuth/GoogleAuth.jsx";
import {useState} from "react";
import checkUserLoggedIn from "../GoogleAuth/checkUserLoggedIn.jsx";
import Redirect from "../Redirect.jsx";

export default function Onboarding() {
    const [userLoginState, setUserLoginState] = useState("none");
    checkUserLoggedIn(setUserLoginState);
    if (userLoginState === "Logged In") {return <Redirect href={"/"}/>}
    return (
        <div onClick={handleGoogle}>
            Login with google
        </div>
    )
}