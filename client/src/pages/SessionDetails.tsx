import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function SessionDetails() {
  const { user } = useAuth();
  const [, params] = useRoute("/session/:id");
  const [, setLocation] = useLocation();

  const sessionId = params?.id ? parseInt(params.id) : null;
  const { data: session, isLoading } = trpc.session.getSessionById.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );

  const cancelMutation = trpc.session.cancelSession.useMutation({
    onSuccess: () => {
      toast.success("Session cancelled");
      setLocation(user?.role === "tutor" ? "/tutor/dashboard" : "/student/dashboard");
    },
    onError: () => {
      toast.error("Failed to cancel session");
    },
  });

  if (isLoading || !sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <Button variant="ghost" size="sm" onClick={() => setLocation(user?.role === "tutor" ? "/tutor/dashboard" : "/student/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </header>
        <main className="container py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Session not found</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const isTutor = user?.id === session.tutorId;
  const isStudent = user?.id === session.studentId;
  const canCancel = session.status === "scheduled" && (isTutor || isStudent);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation(user?.role === "tutor" ? "/tutor/dashboard" : "/student/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-2xl">
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl">{session.subject}</CardTitle>
            <CardDescription>Session Details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Badge */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary capitalize">
                {session.status}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </p>
                <p className="text-base">
                  {new Date(session.scheduledTime).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time
                </p>
                <p className="text-base">
                  {new Date(session.scheduledTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Duration</p>
              <p className="text-base">{session.durationMinutes} minutes</p>
            </div>

            {/* Notes */}
            {session.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                <p className="text-base">{session.notes}</p>
              </div>
            )}

            {/* Participants Info */}
            <div className="pt-4 border-t border-border space-y-4">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Participants
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Tutor ID</p>
                  <p className="font-medium">{session.tutorId}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Student ID</p>
                  <p className="font-medium">{session.studentId}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {canCancel && (
              <div className="pt-4 border-t border-border">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => cancelMutation.mutate({ sessionId: session.id })}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Cancel Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
