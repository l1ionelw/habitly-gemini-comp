import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Onboarding from "./Components/Onboarding/Onboarding.jsx";
import AuthContextProvider from "./AuthContextProvider.jsx";
import Habits from "./Components/Habits/Habits.jsx";
import AboutHabit from "./Components/Habits/AboutHabit.jsx";
import {BrowserRoutes} from "./RouterPaths.jsx";

const router = createBrowserRouter([
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
        element: <Habits/>,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthContextProvider router={router}/>
    </React.StrictMode>,
)
