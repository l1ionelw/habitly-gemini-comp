import {createBrowserRouter} from "react-router-dom";
import App from "./App.jsx";
import Onboarding from "./Components/Onboarding/Onboarding.jsx";
import Habits from "./Components/Habits/Habits.jsx";
import AboutHabit from "./Components/Habits/AboutHabit.jsx";

export const BrowserRoutes = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/onboarding/",
                element: <Onboarding/>
            },
            {
                path: "/habits/",
                element: <Habits/>,
                children: [
                    {
                        path: "/about/",
                        element: <AboutHabit/>
                    }
                ]
            }
        ]
    }
])