import React, { useState, useEffect } from 'react';

export const UserContext = React.createContext();

export const UserProvider = (props) => {

    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {   
        // getCategories();
    }, []);

   
    const state = { user, isAuthenticated };
    const methods = { setUser, setIsAuthenticated };

    return (
        <UserContext.Provider value={{
            ...state,
            ...methods
        }}>
            { props.children }
        </UserContext.Provider>
    )
}