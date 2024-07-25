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
import DailyLog from "./Components/DailyLog/DailyLog.jsx";
import Ai from "./Components/Ai/index.jsx";
import Error404 from "./Error404.jsx";

export const BrowserRoutes = createBrowserRouter([
        {
            path: "/",
            element: <App/>,
            errorElement: <Error404/>
        },
        {
            path: "/onboarding/",
            element: <Onboarding/>
        },
        {
            path: "/habits/",
            element: <Sidebar><Protected><Habits/></Protected></Sidebar>,
        },
        {
            path: "/habits/detail/:habitId",
            element: <Sidebar><Protected><DetailView/></Protected></Sidebar>,
        },
        {
            path: "/tasks/",
            element: <Sidebar><Protected><Tasks/></Protected></Sidebar>
        },
        {
            path: "/logout/",
            element: <Sidebar><Protected><Logout/></Protected></Sidebar>
        },
        {
            path: "/dailylog/",
            element: <Sidebar><Protected><DailyLog/></Protected></Sidebar>
        },
        {
            path: "/ai/",
            element: <Sidebar><Protected><Ai/></Protected></Sidebar>
        }
    ]
)