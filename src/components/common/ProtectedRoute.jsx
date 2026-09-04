import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user?.accountType)
    ) {
        if (user?.accountType === "Admin") {
        return <Navigate to="/admin" replace />;
        }

        if (user?.accountType === "Instructor") {
        return <Navigate to="/instructor" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;