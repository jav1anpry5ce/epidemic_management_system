import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoutes({ children, accessUser }) {
  const auth = useSelector((state) => state.auth);
  switch (accessUser) {
    case "staff":
      return auth.is_auth ? children : <Navigate to="/accounts/login" />;
    case "siteAdmin":
      return auth.is_auth && auth.is_location_admin ? (
        children
      ) : (
        <Navigate to="/accounts/login" />
      );
    case "moh":
      return auth.is_auth && auth.is_moh_staff ? (
        children
      ) : (
        <Navigate to="/accounts/login" />
      );
    case "mohAdmin":
      return auth.is_auth && auth.is_moh_admin ? (
        children
      ) : (
        <Navigate to="/accounts/login" />
      );
    case "reset":
      return auth.is_auth && (auth.is_location_admin || auth.is_moh_admin) ? (
        children
      ) : (
        <Navigate to="/accounts/login" />
      );
    default:
      <Navigate to="/accounts/login" />;
  }
}
