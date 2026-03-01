import { useAuthStatus } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Activity } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex-center bg-background">
        <Activity className="w-12 h-12 text-[hsl(var(--primary))] animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
