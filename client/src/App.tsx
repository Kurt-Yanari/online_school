import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useAuth } from "./_core/hooks/useAuth";
import DashboardLayout from "./components/DashboardLayout";
import TutorDashboard from "./pages/TutorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TutorProfile from "./pages/TutorProfile";
import StudentProfile from "./pages/StudentProfile";
import BrowseTutors from "./pages/BrowseTutors";
import SessionDetails from "./pages/SessionDetails";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Public routes
  if (!user) {
    return (
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Role-based protected routes
  const isTutor = user.role === "tutor";
  const isStudent = user.role === "student";

  return (
    <Switch>
      {/* Tutor routes */}
      {isTutor && (
        <>
          <Route path="/tutor/dashboard" component={TutorDashboard} />
          <Route path="/tutor/profile" component={TutorProfile} />
          <Route path="/session/:id" component={SessionDetails} />
        </>
      )}

      {/* Student routes */}
      {isStudent && (
        <>
          <Route path="/student/dashboard" component={StudentDashboard} />
          <Route path="/student/profile" component={StudentProfile} />
          <Route path="/student/browse-tutors" component={BrowseTutors} />
          <Route path="/session/:id" component={SessionDetails} />
        </>
      )}

      {/* Common routes */}
      <Route path="/" component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
