import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function StudentProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profile, isLoading: profileLoading } = trpc.student.getProfile.useQuery();
  const updateMutation = trpc.student.updateProfile.useMutation();

  const [gradeLevel, setGradeLevel] = useState("");
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (profile) {
      setGradeLevel(profile.gradeLevel || "");
      setInterests(profile.interests || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        gradeLevel,
        interests,
        bio,
      });
      toast.success("Profile updated successfully");
      setLocation("/student/dashboard");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (profileLoading) {
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
        <div className="container flex h-16 items-center">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/student/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-2xl">
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>Complete your profile to find the right tutors</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={user?.name || ""} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={user?.email || ""} disabled className="bg-muted" />
              </div>

              {/* Grade Level */}
              <div className="space-y-2">
                <label htmlFor="gradeLevel" className="text-sm font-medium">
                  Grade Level
                </label>
                <Input
                  id="gradeLevel"
                  placeholder="e.g., 10th Grade, College, Adult"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                />
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <label htmlFor="interests" className="text-sm font-medium">
                  Subjects of Interest
                </label>
                <p className="text-xs text-muted-foreground">
                  Enter subjects you want to learn, separated by commas
                </p>
                <Textarea
                  id="interests"
                  placeholder="Mathematics, Physics, Chemistry"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="min-h-24"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  About You
                </label>
                <p className="text-xs text-muted-foreground">
                  Tell tutors about your learning goals and background
                </p>
                <Textarea
                  id="bio"
                  placeholder="I'm preparing for my final exams and need help with..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-32"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1"
                >
                  {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Profile
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/student/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
