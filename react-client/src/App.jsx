import './App.css'

import {useContext} from "react";
import Redirect from "./Components/Redirect.jsx";
import Habits from "./Components/Habits/Habits.jsx";
import Loading from "./Components/Loading.jsx";
import {AuthContext} from "./Contexts/AuthContext.jsx";
import {Navigate, redirect} from "react-router-dom";

function App() {
    const userLoginState = useContext(AuthContext);

    if (typeof userLoginState === "object") {
        return <Redirect href={"/habits"}/>
    }
    if (userLoginState === "Not Logged In") {
        return <Redirect href={"/onboarding"}/>
    }
    return <Loading/>
}

export default App
