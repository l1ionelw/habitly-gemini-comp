import {createBrowserRouter} from "react-router-dom";
import App from "./App.jsx";
import Onboarding from "./Components/Onboarding/Onboarding.jsx";
import Habits from "./Components/Habits/Habits.jsx";
import React from "react";
import Protected from "./Components/Protected.jsx";
import DetailView from "./Components/Habits/DetailViewer/DetailView.jsx";
import Sidebar from "./Components/Sidebar/Sidebar.jsx";
import Tasks from "./Components/Tasks/Tasks.jsx";
import Logout from "./Components/Logout/index.jsx";
import DailyLog from "./Components/DailyLog/index.jsx";

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
            element: <Protected><Sidebar><Habits/></Sidebar></Protected>,
        },
        {
            path: "/habits/detail/:habitId",
            element: <Protected><Sidebar><DetailView/></Sidebar></Protected>,
        },
        {
            path: "/tasks/",
            element: <Protected><Sidebar><Tasks/></Sidebar></Protected>
        },
        {
            path: "/logout/",
            element: <Protected><Sidebar><Logout/></Sidebar></Protected>
        },
        {
            path: "/dailylog/",
            element: <Protected><Sidebar><DailyLog/></Sidebar></Protected>
        }
    ]
)