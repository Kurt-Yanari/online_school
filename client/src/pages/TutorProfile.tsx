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

export default function TutorProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profile, isLoading: profileLoading } = trpc.tutor.getProfile.useQuery();
  const updateMutation = trpc.tutor.updateProfile.useMutation();

  const [specializations, setSpecializations] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  useEffect(() => {
    if (profile) {
      setSpecializations(profile.specializations || "");
      setBio(profile.bio || "");
      setHourlyRate(profile.hourlyRate?.toString() || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        specializations,
        bio,
        hourlyRate: hourlyRate ? parseInt(hourlyRate) : undefined,
      });
      toast.success("Profile updated successfully");
      setLocation("/tutor/dashboard");
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
          <Button variant="ghost" size="sm" onClick={() => setLocation("/tutor/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-2xl">
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle>Tutor Profile</CardTitle>
            <CardDescription>Set up your profile to start accepting students</CardDescription>
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

              {/* Specializations */}
              <div className="space-y-2">
                <label htmlFor="specializations" className="text-sm font-medium">
                  Specializations
                </label>
                <p className="text-xs text-muted-foreground">
                  Enter subjects you teach, separated by commas (e.g., Mathematics, Physics, Chemistry)
                </p>
                <Textarea
                  id="specializations"
                  placeholder="Mathematics, Physics, Chemistry"
                  value={specializations}
                  onChange={(e) => setSpecializations(e.target.value)}
                  className="min-h-24"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                <p className="text-xs text-muted-foreground">
                  Tell students about yourself and your teaching experience
                </p>
                <Textarea
                  id="bio"
                  placeholder="I'm a passionate educator with 10 years of experience..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-32"
                />
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2">
                <label htmlFor="hourlyRate" className="text-sm font-medium">
                  Hourly Rate (USD)
                </label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="50"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  min="0"
                  step="1"
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
                  onClick={() => setLocation("/tutor/dashboard")}
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
