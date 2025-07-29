import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "super_admin";
  requiredPermission?: string;
}

export default function AdminRoute({ 
  children, 
  requiredRole = "admin",
  requiredPermission 
}: AdminRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  // Check role-based access
  if (!hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have the required permissions to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Insufficient Permissions</h1>
          <p className="text-muted-foreground">
            You don't have the required permission: {requiredPermission}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
