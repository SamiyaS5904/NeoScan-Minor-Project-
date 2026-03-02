import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api, buildUrl } from "../shared/routes";
import { useState, useEffect } from "react";


// --------------------
// AUTH STATUS
// --------------------

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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


// --------------------
// LOGIN
// --------------------

export function useLogin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(buildUrl("/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid credentials");
        }
        throw new Error("Login failed");
      }

      return res.json();
    },

    onSuccess: (data) => {
      localStorage.setItem("neoscan_token", data.token);
      localStorage.setItem("neoscan_user", JSON.stringify(data.user));

      queryClient.clear();

      // Quick demo → always go dashboard
      setLocation("/dashboard");
    },
  });
}


// --------------------
// REGISTER
// --------------------

export function useRegister() {
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(buildUrl("/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      return res.json();
    },

    onSuccess: (data) => {
      localStorage.setItem("neoscan_token", data.token);
      localStorage.setItem("neoscan_user", JSON.stringify(data.user));

      // Quick demo → go setup directly to force baby details
      setLocation("/setup");
    },
  });
}