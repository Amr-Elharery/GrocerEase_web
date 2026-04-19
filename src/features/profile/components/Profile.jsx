import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { authService } from "@/features/auth/api/authService";
import { User, Mail, Phone, Pencil, X, Save } from "lucide-react";
export default function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (!authService.isAuthenticated()) navigate("/auth");;
  }, [navigate]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name ?? "", phone: user.phone ?? "" });
    }
  }, [user?.name, user?.phone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile.mutate(formData, { onSuccess: () => setEditMode(false) });
  };

  const handleCancel = () => {
    setFormData({ name: user.name, phone: user.phone });
    setEditMode(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/auth");
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="app" onLogout={handleLogout} />

      <main className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden px-4 py-10">
      
        <Card className="relative z-10 w-full max-w-md shadow-xl border-border/50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Name
              </Label>
              {editMode ? (
                <Input name="name" value={formData.name} onChange={handleChange} />
              ) : (
                <div className="h-10 px-3 flex items-center rounded-md border border-input bg-muted/40 text-sm">
                  {user?.name}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </Label>
              <div className="h-10 px-3 flex items-center rounded-md border border-input bg-muted/40 text-sm text-muted-foreground">
                {user?.email}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone
              </Label>
              {editMode ? (
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              ) : (
                <div className="h-10 px-3 flex items-center rounded-md border border-input bg-muted/40 text-sm">
                  {user?.phone}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              {!editMode ? (
                <Button onClick={() => setEditMode(true)} className="w-full gap-2">
                  <Pencil className="w-4 h-4" /> Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} className="flex-1 gap-2" disabled={updateProfile.isPending}>
                    <Save className="w-4 h-4" />
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 gap-2">
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
