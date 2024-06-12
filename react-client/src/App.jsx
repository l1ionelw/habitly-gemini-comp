import './App.css'
import checkUserLoggedIn from "./Components/GoogleAuth/checkUserLoggedIn.jsx";
import handleGoogle from "./Components/GoogleAuth/GoogleAuth.jsx";

function App() {
    const isUserLoggedIn = checkUserLoggedIn();
    return (
        <>
            <div hidden={!isUserLoggedIn}>
                <p className={"text-lg"}>user logged in</p>
            </div>
            <div hidden={isUserLoggedIn} onClick={handleGoogle}>Log in With google!</div>
        </>
    )
}

export default App
