import React from 'react';
import "./Google.css"

export default function GoogleLoginButton() {
    return (
        <div className={"login-w-google-container cursor-pointer"}>
            <button type={"button"} className={"login-with-google-btn centered-xy"}>
                Continue with Google
            </button>
        </div>
    );
}
