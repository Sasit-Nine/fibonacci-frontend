import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginPage = () => {
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            navigate("/");
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-semibold text-white mb-6">Welcome !</h1>
                
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-5 py-3 
                               bg-green-500 text-white text-lg font-medium rounded-lg 
                               shadow-md hover:bg-green-700 transition duration-300 
                               disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    tabIndex={4}
                    disabled={processing}
                    onClick={async () => {
                        setProcessing(true);
                        try {
                            window.location.href = "http://localhost:8000/auth/google";
                        } catch (error) {
                            console.log("Google Button Login :", error);
                        } finally {
                            setProcessing(false);
                        }
                    }}
                >
                    {processing && (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            />
                        </svg>
                    )}
                    <FontAwesomeIcon icon={faGoogle} />
                    Log in with Google
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
