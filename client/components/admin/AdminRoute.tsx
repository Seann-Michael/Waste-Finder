import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // Check again before rendering to prevent flash
  const isLoggedIn = localStorage.getItem("adminLoggedIn");
  if (!isLoggedIn) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
