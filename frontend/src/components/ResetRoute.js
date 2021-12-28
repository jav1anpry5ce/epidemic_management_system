import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ResetRoute({ children }) {
  const auth = useSelector((state) => state.auth);
  return auth.is_auth && (auth.is_location_admin || auth.is_moh_admin) ? (
    children
  ) : (
    <Navigate to="/accounts/login" />
  );
}
