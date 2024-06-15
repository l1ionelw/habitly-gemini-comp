import './App.css'
import {useContext} from "react";
import {Auth} from "./Components/Contexts/AuthContext.jsx";
import {Navigate} from "react-router-dom";
import Loading from "./Components/Loading.jsx";


export default function App() {
    const userLoginState = useContext(Auth).authState;
    console.log(userLoginState);
    if (userLoginState === "Logged In") {
        return <Navigate to={"/habits"} replace={true}/>
    }
    if (userLoginState === "Not Logged In") {
        return <Navigate to={"/onboarding"} replace={true}/>
    }
    return <Loading/>
}
