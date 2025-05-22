import React, { useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import UpdateQuestion from './UpdateQuestion';

const Login = () => {
    const inputRef = useRef(null);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    const { isLoggedIn, setPassword } = useAuth();

    const handleFocus = () => {
        inputRef.current?.focus();
    };

    const handleProceed = () => {
        setPassword(input)
        !isLoggedIn && setError('❌ Incorrect password');
        setInput("");
    };

    return (
        <>
            {!isLoggedIn ? (<>
                <div
                    style={{
                        padding: "0.7rem",
                        maxWidth: '600px',
                        margin: "auto",
                        border: "1px solid #666",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        cursor: "text",
                        color: "#666",
                        marginTop: "30vh"
                    }}
                    onClick={handleFocus}
                >
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <p style={{ margin: 0 }}>Password:</p>
                        <input
                            ref={inputRef}
                            className="input"
                            type="text"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value)
                                setError("")
                            }}
                            style={{ border: "none", width: "100%", color: "#666" }}
                        />
                    </div>



                    {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
                </div>
                <button
                    onClick={handleProceed}
                    style={{
                        alignSelf: "flex-end",
                        background: "rgba(0, 120, 255, 0.2)",
                        border: "none",
                        padding: "0.6rem 0",
                        width: "100%",
                        cursor: "pointer",
                        marginTop: "1rem"
                    }}
                >
                    Proceed
                </button>
            </>
            ) : (
                <UpdateQuestion />
            )}
        </>
    );
};

export default Login;
