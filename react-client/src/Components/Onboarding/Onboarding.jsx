import handleGoogle from "../GoogleAuth/GoogleAuth.jsx";
import GoogleLoginButton from "../GoogleAuth/GoogleLoginButton.jsx";


export default function Onboarding() {
    return (
        <div>
            <div onClick={handleGoogle} className={"cursor-pointer"}>
                <GoogleLoginButton/>
            </div>
            <div className={"flex justify-center select-none"}>
                <div onClick={()=>handleGoogle("Demo")}>
                    <div></div>
                    <div>Login to Demo Account</div>
                </div>
            </div>
        </div>
    )
}