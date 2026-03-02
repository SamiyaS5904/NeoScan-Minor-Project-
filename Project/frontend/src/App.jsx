import { Route, Switch } from "wouter";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Landing } from "./pages/Landing";
import { About } from "./pages/About";
import { BabySetup } from "./pages/BabySetup";
import { Calibrate } from "./pages/Calibrate";
import { Dashboard } from "./pages/Dashboard";
import { JaundiceInfo } from "./pages/JaundiceInfo";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Research } from "./pages/Research";
import { Scan } from "./pages/Scan";
import NotFound from "./pages/not-found";

function App() {
  return (
    <>
      <Navbar />

      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/about" component={About} />
        <Route path="/setup" component={BabySetup} />
        <Route path="/calibrate" component={Calibrate} />
        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/info" component={JaundiceInfo} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/research" component={Research} />
        <Route path="/scan" component={Scan} />
        <Route component={NotFound} />
      </Switch>

      <Footer />
    </>
  );
}

export default App;