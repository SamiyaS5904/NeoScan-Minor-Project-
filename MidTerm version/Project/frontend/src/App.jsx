import { Route, Switch } from "wouter";

// Layout components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import BabySetup from "./pages/BabySetup";
import Calibrate from "./pages/Calibrate";
import JaundiceInfo from "./pages/JaundiceInfo";
import Research from "./pages/Research";
import Scan from "./pages/Scan";
import NotFound from "./pages/not-found";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Main page content container */}
      <main className="flex-1 w-full">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/about" component={About} />
          <Route path="/setup" component={BabySetup} />
          <Route path="/calibrate" component={Calibrate} />
          <Route path="/jaundice-info" component={JaundiceInfo} />
          <Route path="/research" component={Research} />
          <Route path="/scan" component={Scan} />

          {/* Catch-all route for 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />
    </div>
  );
}

export default App;