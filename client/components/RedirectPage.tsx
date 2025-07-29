import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectPageProps {
  to: string;
  message?: string;
}

export default function RedirectPage({ to, message = "Redirecting..." }: RedirectPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediate redirect
    navigate(to, { replace: true });
  }, [navigate, to]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
