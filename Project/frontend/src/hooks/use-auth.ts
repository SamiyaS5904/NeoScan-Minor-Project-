import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { z } from "zod";

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("neoscan_token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("neoscan_token");
    localStorage.removeItem("neoscan_user");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return { isAuthenticated, isLoading, logout };
}

export function useLogin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.auth.login.input>) => {
      const res = await fetch(api.auth.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid credentials");
        throw new Error("Failed to login");
      }
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("neoscan_token", data.token);
      localStorage.setItem("neoscan_user", JSON.stringify(data.user));
      queryClient.clear();
      if (!data.hasBaby) {
        setLocation("/baby-setup");
      } else {
        setLocation("/dashboard");
      }
    },
  });
}

export function useRegister() {
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.auth.register.input>) => {
      const res = await fetch(api.auth.register.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Registration failed");
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("neoscan_token", data.token);
      localStorage.setItem("neoscan_user", JSON.stringify(data.user));
      setLocation("/baby-setup");
    },
  });
}
