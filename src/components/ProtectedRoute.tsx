import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authChecked, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!authChecked) {
    return <div className="p-10 text-lg font-medium">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
