import {createBrowserRouter} from "react-router-dom";
import App from "./App.jsx";
import Onboarding from "./Components/Onboarding/Onboarding.jsx";
import Habits from "./Components/Habits/Habits.jsx";
import React from "react";
import Protected from "./Components/Protected.jsx";
import DetailView from "./Components/DetailViewer/DetailView.jsx";

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
    },
    {
        path: "/habits/detail/:habitId/",
        element: <Protected><DetailView/></Protected>
    }
])