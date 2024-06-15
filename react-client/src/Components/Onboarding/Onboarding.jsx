import handleGoogle from "../GoogleAuth/GoogleAuth.jsx";


export default function Onboarding() {
    return (
        <div onClick={handleGoogle}>
            Login with google
        </div>
    )
}