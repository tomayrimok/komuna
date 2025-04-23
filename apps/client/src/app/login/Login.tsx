import React, { useState } from "react";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
        confirmationResult: ConfirmationResult;
    }
}

export default function Login() {
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [step, setStep] = useState<1 | 2>(1);

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: () => { },
                },
            );
        }
    };

    const sendCode = async () => {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, phone, appVerifier);
        setConfirmationResult(result);
        setStep(2);
    };

    const verifyCode = async () => {
        try {
            const result = await confirmationResult.confirm(code);
            alert("Authenticated as: " + result.user.phoneNumber);
        } catch (err) {
            alert("Invalid code");
        }
    };

    return (
        <div>
            {step === 1 && (
                <div>
                    <input
                        type="tel"
                        placeholder="+9725XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button onClick={sendCode}>Send SMS</button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={verifyCode}>Verify</button>
                </div>
            )}
            <div id="recaptcha-container"></div>
        </div>
    );
}
