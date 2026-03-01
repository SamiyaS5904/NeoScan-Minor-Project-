import React, { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Components & Layouts
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import { Landing } from "./pages/Landing";
import { About } from "./pages/About";
import { Research } from "./pages/Research";
import { JaundiceInfo } from "./pages/JaundiceInfo";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { BabySetup } from "./pages/BabySetup";
import { Dashboard } from "./pages/Dashboard";
import { Calibrate } from "./pages/Calibrate";
import { Scan } from "./pages/Scan";

function Router() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/research" component={Research} />
          <Route path="/jaundice-info" component={JaundiceInfo} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          <Route path="/baby-setup">
            {() => (
              <ProtectedRoute>
                <BabySetup />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/dashboard">
            {() => (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/calibrate">
            {() => (
              <ProtectedRoute>
                <Calibrate />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/scan">
            {() => (
              <ProtectedRoute>
                <Scan />
              </ProtectedRoute>
            )}
          </Route>

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
useEffect(() => {
  fetch("http://127.0.0.1:5000/api/health")
    .then(res => res.json())
    .then(data => {
      console.log("Backend response:", data);
    })
    .catch(err => {
      console.log("Error:", err);
    });
}, []);
export default App;


