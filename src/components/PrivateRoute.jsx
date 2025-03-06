import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

const PrivateRoute = ({ children }) => {
    const user = auth.currentUser; // Check if user is authenticated

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

