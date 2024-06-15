import {Children, useContext} from "react";
import {Auth} from "./Contexts/AuthContext.jsx";
import {Navigate} from "react-router-dom";
import Loading from "./Loading.jsx";

export default function Protected({children}) {
    const userLoginState = useContext(Auth).authState;
    if (userLoginState === "Logged In") {
        return children;
    }
    else if (userLoginState === "Not Logged In") {
        return <Navigate to={"/"} replace={true}/>
    }
    else {
        return <Loading/>
    }
}