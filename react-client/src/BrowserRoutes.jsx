import {createBrowserRouter} from "react-router-dom";
import App from "./App.jsx";
import Onboarding from "./Components/Onboarding/Onboarding.jsx";
import Habits from "./Components/Habits/Habits.jsx";
import React from "react";
import Protected from "./Components/Protected.jsx";

export const BrowserRoutes = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "/onboarding/",
        element: <Onboarding/>
    },
    {
        path: "/habits/",
        element: <Protected><Habits/></Protected>,
    }
])