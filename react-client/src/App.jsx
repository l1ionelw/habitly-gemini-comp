import './App.css'
import checkUserLoggedIn from "./Components/GoogleAuth/checkUserLoggedIn.jsx";
import {useState} from "react";
import Redirect from "./Components/Redirect.jsx";
import ErrorLandingPage from "./Components/ErrorLandingPage.jsx";

function App() {
    const [userLoginState, setUserLoginState] = useState("none");
    checkUserLoggedIn(setUserLoginState);
    if (userLoginState === "Logged In") {
        return <div>User is logged in. Make some fancy api calls to firestore and return a beautiful homepage when the hard work is over :p</div>
    }
    if (userLoginState === "Not Logged In") {
        return <Redirect href={"onboarding"}/>
    }
    return (
        <ErrorLandingPage
        message={"You're not supposed to see this... Try clearing your cookies and refreshing this page."}
        />
    )
}

export default App
