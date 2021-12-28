import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MOHRoutes({ children }) {
  const auth = useSelector((state) => state.auth);
  return auth.is_auth && auth.is_moh_staff ? (
    children
  ) : (
    <Navigate to="/accounts/login" />
  );
}
