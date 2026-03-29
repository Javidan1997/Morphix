import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../admin/AdminAuthContext";

function AdminRoute({ children }) {
  const { session } = useAdminAuth();
  const location = useLocation();

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
}

export default AdminRoute;
