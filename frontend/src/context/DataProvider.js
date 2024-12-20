import React, { createContext, useState } from "react";

// Create a context
export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
    const [account, setAccount] = useState({ fullname: '', username: '', _id: '', profileImg: '', });

    return React.createElement(
        DataContext.Provider,
        { value: { account, setAccount } },
        children
    );
};

export default DataProvider;
