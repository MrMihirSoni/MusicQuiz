import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState(null);

    useEffect(() => {
        if (password === "joker") {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [password]);

    return (
        <AuthContext.Provider value={{ setPassword, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
