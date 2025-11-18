import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Star } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BrowseTutors() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: tutors, isLoading: tutorsLoading } = trpc.session.getAllTutors.useQuery();
  const requestMutation = trpc.session.requestSession.useMutation();

  const [selectedTutor, setSelectedTutor] = useState<number | null>(null);
  const [proposedTime, setProposedTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestSession = async () => {
    if (!selectedTutor || !proposedTime || !subject) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await requestMutation.mutateAsync({
        tutorId: selectedTutor,
        proposedTime: new Date(proposedTime),
        durationMinutes: parseInt(duration),
        subject,
        message,
      });
      toast.success("Session request sent successfully");
      setSelectedTutor(null);
      setProposedTime("");
      setDuration("60");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send session request");
    }
  };

  if (tutorsLoading) {
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/student/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Find Tutors</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {tutors && tutors.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No tutors available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {tutors?.map((tutor) => (
              <Card key={tutor.id} className="hover:shadow-lg transition-shadow hover:border-primary/50 overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">Tutor</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{tutor.rating || "0.0"}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Specializations */}
                  {tutor.specializations && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Specializations</p>
                      <p className="text-sm">{tutor.specializations}</p>
                    </div>
                  )}

                  {/* Bio */}
                  {tutor.bio && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">About</p>
                      <p className="text-sm line-clamp-3">{tutor.bio}</p>
                    </div>
                  )}

                  {/* Rate */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Hourly Rate</p>
                    <p className="text-lg font-bold">${(tutor.hourlyRate || 0) / 100}</p>
                  </div>

                  {/* Sessions Count */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {tutor.totalSessions} sessions completed
                    </p>
                  </div>

                  {/* Book Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full"
                        onClick={() => setSelectedTutor(tutor.userId)}
                      >
                        Request Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request a Session</DialogTitle>
                        <DialogDescription>
                          Fill in the details for your session request
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Subject */}
                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-sm font-medium">
                            Subject
                          </label>
                          <Input
                            id="subject"
                            placeholder="e.g., Algebra, Physics"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                          />
                        </div>

                        {/* Proposed Time */}
                        <div className="space-y-2">
                          <label htmlFor="time" className="text-sm font-medium">
                            Proposed Time
                          </label>
                          <Input
                            id="time"
                            type="datetime-local"
                            value={proposedTime}
                            onChange={(e) => setProposedTime(e.target.value)}
                          />
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                          <label htmlFor="duration" className="text-sm font-medium">
                            Duration (minutes)
                          </label>
                          <Input
                            id="duration"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            min="30"
                            step="30"
                          />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium">
                            Message (optional)
                          </label>
                          <Textarea
                            id="message"
                            placeholder="Tell the tutor about your learning goals..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-20"
                          />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4 pt-4">
                          <Button
                            className="flex-1"
                            onClick={handleRequestSession}
                            disabled={requestMutation.isPending}
                          >
                            {requestMutation.isPending && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Send Request
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
