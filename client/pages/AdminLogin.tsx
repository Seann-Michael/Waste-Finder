import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";

type LoginMode = "login" | "forgot-password" | "reset-sent";

export default function AdminLogin() {
  const [mode, setMode] = useState<LoginMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login, isAuthenticated, isLoading } = useAuth();

  // Handle redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Use window.location to avoid router conflicts
      window.location.hash = "#/admin";
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while redirecting
  if (isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!username.trim() || !password) {
      setError("Please enter both username and password");
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(username.trim(), password);
      if (!success) {
        setError("Invalid username or password");
        setPassword("");
      }
      // If successful, AuthContext will handle the redirect
    } catch (err) {
      setError("Login failed. Please try again.");
      setPassword("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email.trim()) {
      setError("Please enter your email address");
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate forgot password API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo, just show success message
      setMode("reset-sent");
      setSuccess(`Password reset instructions sent to ${email}`);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setMode("login");
    setUsername("");
    setPassword("");
    setEmail("");
    setError("");
    setSuccess("");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {mode === "forgot-password" ? (
                <Mail className="w-12 h-12 text-primary" />
              ) : (
                <Shield className="w-12 h-12 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {mode === "login" && "Admin Login"}
              {mode === "forgot-password" && "Reset Password"}
              {mode === "reset-sent" && "Check Your Email"}
            </CardTitle>
            <CardDescription>
              {mode === "login" && "Enter your credentials to access the admin panel"}
              {mode === "forgot-password" && "Enter your email to receive reset instructions"}
              {mode === "reset-sent" && "We've sent password reset instructions to your email"}
            </CardDescription>
            {mode === "login" && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                <p className="text-sm font-medium text-yellow-800 mb-2">Development Credentials:</p>
                <div className="text-xs text-yellow-700 space-y-1">
                  <div><strong>Username:</strong> admin</div>
                  <div><strong>Password:</strong> admin123</div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !username.trim() || !password}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode("forgot-password")}
                    disabled={isSubmitting}
                    className="text-sm"
                  >
                    Forgot your password?
                  </Button>
                </div>
              </form>
            )}

            {mode === "forgot-password" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email address"
                    required
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !email.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="text-sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                  </Button>
                </div>
              </form>
            )}

            {mode === "reset-sent" && (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  If an account with that email exists, you'll receive password reset instructions shortly.
                </p>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            )}

            {mode === "login" && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Demo credentials:</p>
                <p className="font-mono">admin / wastefinderadmin2024</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
