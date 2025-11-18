import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, Clock, Users, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function TutorDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profile, isLoading: profileLoading } = trpc.tutor.getProfile.useQuery();
  const { data: sessions, isLoading: sessionsLoading } = trpc.tutor.getSessions.useQuery();
  const { data: requests, isLoading: requestsLoading } = trpc.tutor.getSessionRequests.useQuery();

  useEffect(() => {
    if (!profile && !profileLoading) {
      setLocation("/tutor/profile");
    }
  }, [profile, profileLoading, setLocation]);

  const upcomingSessions = sessions?.filter(s => s.status === "scheduled") || [];
  const completedSessions = sessions?.filter(s => s.status === "completed") || [];
  const pendingRequests = requests?.filter(r => r.status === "pending") || [];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (profileLoading || sessionsLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tutor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setLocation("/tutor/profile")}>
              Profile
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSessions.length}</div>
              <p className="text-xs text-muted-foreground">Completed sessions</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingSessions.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled sessions</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground">Pending requests</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.rating || "0.0"}</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Pending Requests */}
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <CardHeader>
              <CardTitle>Session Requests</CardTitle>
              <CardDescription>Pending requests from students</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="flex items-start justify-between p-3 rounded-lg bg-card border border-border hover:bg-accent transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{req.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(req.proposedTime).toLocaleString()}
                        </p>
                        {req.message && <p className="text-xs mt-2">{req.message}</p>}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            trpc.tutor.acceptSessionRequest.useMutation().mutate({ requestId: req.id });
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            trpc.tutor.declineSessionRequest.useMutation().mutate({ requestId: req.id });
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming sessions</p>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3 rounded-lg bg-card border border-border hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => setLocation(`/session/${session.id}`)}
                    >
                      <p className="font-medium text-sm">{session.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.scheduledTime).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Duration: {session.durationMinutes} minutes
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
