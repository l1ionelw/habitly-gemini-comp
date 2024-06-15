import {useState} from "react";
import checkUserLoggedIn from "./Utils/checkUserLoggedIn.js";
import {AuthContext} from "./Contexts/AuthContext.jsx";
import {RouterProvider} from "react-router-dom";

export default function AuthContextProvider({router}) {
    const [userLoginState, setUserLoginState] = useState("null");
    console.log("[AuthContextProvider] getting user login state");
    checkUserLoggedIn(setUserLoginState);

    return (
        <AuthContext.Provider value={userLoginState}>
            <RouterProvider router={router}/>
        </AuthContext.Provider>
    )
}