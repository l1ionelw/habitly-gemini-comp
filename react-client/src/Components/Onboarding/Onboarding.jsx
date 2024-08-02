import handleGoogle from "../GoogleAuth/GoogleAuth.jsx";
import GoogleLoginButton from "../GoogleAuth/GoogleLoginButton.jsx";


export default function Onboarding() {
    return (
        <div onClick={handleGoogle} className={"cursor-pointer"}>
            <GoogleLoginButton/>
        </div>
    )
}