import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoutes({ children }) {
  const auth = useSelector((state) => state.auth);
  return auth.is_auth ? children : <Navigate to="/accounts/login" />;
}
