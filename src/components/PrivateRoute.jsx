import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <p style={{ padding: "30px" }}>Oturum kontrol ediliyor...</p>;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
