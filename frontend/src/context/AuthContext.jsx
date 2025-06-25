import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async() => {
            try{
                const res = await axiosClient({
                    method: "get",
                    url: '/user',
                    withCredentials: true
                });

                setUser(res.data.user);
            } catch(e) {
                console.error("Failed to fetch the user",e);
            } finally {
                setUserLoading(false);
            }
        };

        fetchUser();
    }, []);

    return <AuthContext.Provider value={ { user, userLoading } }>{children}</AuthContext.Provider>
}

export function useUser() {
    return useContext(AuthContext);
}