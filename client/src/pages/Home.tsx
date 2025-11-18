import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Users, Calendar, Zap } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "tutor") {
        setLocation("/tutor/dashboard");
      } else if (user.role === "student") {
        setLocation("/student/dashboard");
      }
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleLoginAsRole = (role: string) => {
    const loginUrl = getLoginUrl();
    // Store the role preference in session storage
    sessionStorage.setItem("preferredRole", role);
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="w-8 h-8" />}
            <h1 className="text-xl font-bold text-foreground">{APP_TITLE}</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container py-12 md:py-24">
        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Connect with Tutors & Students
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            A minimalist platform for personalized learning. Whether you're a tutor sharing expertise
            or a student seeking guidance, {APP_TITLE} makes it simple to schedule and manage sessions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <Card className="hover:shadow-lg transition-shadow hover:border-primary/50">
            <CardHeader className="pb-3">
              <BookOpen className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-base">Easy Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Schedule sessions at times that work for you
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow hover:border-primary/50">
            <CardHeader className="pb-3">
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-base">Find Perfect Match</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse tutors by specialization and rating
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow hover:border-primary/50">
            <CardHeader className="pb-3">
              <Calendar className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-base">Manage Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track all your sessions in one place
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow hover:border-primary/50">
            <CardHeader className="pb-3">
              <Zap className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-base">Minimalist Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Clean, dark interface for comfortable learning
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Role Selection */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Choose Your Role
          </h3>

          <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            {/* Tutor Card */}
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>I'm a Tutor</CardTitle>
                <CardDescription>Share your expertise and help students learn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Set your specializations and hourly rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Receive and manage session requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Build your student base and ratings</span>
                  </li>
                </ul>
                <Button
                  className="w-full mt-6"
                  onClick={() => handleLoginAsRole("tutor")}
                >
                  Sign In as Tutor
                </Button>
              </CardContent>
            </Card>

            {/* Student Card */}
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>I'm a Student</CardTitle>
                <CardDescription>Find the right tutor for your learning goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Browse tutors by subject and rating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Request sessions at your convenience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Track all your learning sessions</span>
                  </li>
                </ul>
                <Button
                  className="w-full mt-6"
                  onClick={() => handleLoginAsRole("student")}
                >
                  Sign In as Student
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>{APP_TITLE} © 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
