import { useEffect } from "react";
import { useUser } from "./AuthContext";
import { useNavigate } from "react-router";
import { FullScreenLoader } from "../components/ui/Loader";

const ProtectedRoute = ({ children }) => {
    const { user, userLoading } = useUser();
    const navigate = useNavigate();

    console.log(user, userLoading);

    useEffect(() => {
        if(!user && !userLoading) {
            navigate("/login");
        }
    }, [user, navigate]);

    if(userLoading) return <FullScreenLoader message={"Gathering Data..."} />

    return user ? children : null;
};

export default ProtectedRoute;