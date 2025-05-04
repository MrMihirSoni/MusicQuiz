import React, { createContext, useState, useContext } from 'react';

const TestContext = createContext();

export const useTestContext = () => useContext(TestContext);

export const TestProvider = ({ children }) => {
    const [category, setCategory] = useState("");
    const [categorySelected, setCategorySelected] = useState("");
    const [limit, setLimit] = useState(10);

    return (
        <TestContext.Provider value={{ category, setCategory, limit, setLimit, categorySelected, setCategorySelected }}>
            {children}
        </TestContext.Provider>
    );
};
