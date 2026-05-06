import { useState } from "react";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Phone,
  Pencil,
  X,
  Save,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

export default function Profile() {
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleEdit = () => {
    setFormData({
      name: user?.name ?? "",
      phone: user?.phone ?? "",
    });
    setEditMode(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile.mutate(formData, {
      onSuccess: () => setEditMode(false),
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      name: user?.name ?? "",
      phone: user?.phone ?? "",
    });
  };

  if (isLoading) {
    return (
      <section className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-[#6B7A70]">Loading profile...</p>
      </section>
    );
  }

  return (
    <section>
      <div className="overflow-hidden rounded-3xl border border-[#DDE7E0] bg-white shadow-sm">
        {/* Banner */}
        <div className="relative bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#52B788] px-6 py-4">
          <div className="absolute right-10 top-3 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute right-32 bottom-[-30px] h-16 w-16 rounded-full bg-white/10" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D8F3DC]">
                ZAD Admin Portal
              </p>

              <h1 className="mt-2 text-2xl font-black tracking-tight text-white">
                My Profile
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-5 text-[#F8FAF8]">
                Manage your account information and access settings.
              </p>
            </div>

            {!editMode ? (
              <Button
                type="button"
                onClick={handleEdit}
                className="shrink-0 gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#1B4332] hover:bg-[#E6F3EB]"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={updateProfile.isPending}
                  className="gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#1B4332] hover:bg-[#E6F3EB]"
                >
                  <Save className="h-4 w-4" />
                  {updateProfile.isPending ? "Saving..." : "Save"}
                </Button>

                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="gap-2 rounded-xl border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-4 p-4 lg:grid-cols-[260px_1fr]">
          {/* Left Card */}
          <div className="rounded-2xl border border-[#E2E8E3] bg-[#F8FAF8] p-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2D6A4F] text-white shadow-lg shadow-green-900/20">
                <User className="h-7 w-7" />
              </div>

              <h2 className="mt-3 text-lg font-black text-[#1a1f2e]">
                {user?.name}
              </h2>

              <p className="mt-1 text-sm text-[#6B7A70]">{user?.email}</p>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#E6F3EB] px-3 py-1 text-xs font-bold text-[#2D6A4F]">
                  <ShieldCheck className="h-4 w-4" />
                  Active
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-[#E6F3EB] px-3 py-1 text-xs font-bold text-[#1B4332]">
                  <BadgeCheck className="h-4 w-4" />
                  Admin
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-[#E2E8E3] pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7A70]">Account Type</span>
                <span className="font-bold text-[#1a1f2e]">Admin</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7A70]">Status</span>
                <span className="font-bold text-[#2D6A4F]">Active</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7A70]">Last Update</span>
                <span className="font-bold text-[#1a1f2e]">Today</span>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="rounded-2xl border border-[#E2E8E3] bg-white p-4">
            <div className="mb-4">
              <h3 className="text-xl font-black text-[#1a1f2e]">
                Account Information
              </h3>

              <p className="mt-1 text-sm text-[#6B7A70]">
                These details are used for account identification and platform
                access.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#1a1f2e]">
                  <User className="h-4 w-4" />
                  Full Name
                </label>

                {editMode ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-10 rounded-xl border-[#DFE7E1] bg-white text-sm focus-visible:ring-[#52B788]/30"
                  />
                ) : (
                  <div className="flex h-10 items-center rounded-xl border border-[#DFE7E1] bg-[#F8FAF8] px-4 text-sm font-medium text-[#1a1f2e]">
                    {user?.name}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#1a1f2e]">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>

                <div className="flex h-10 items-center rounded-xl border border-[#DFE7E1] bg-[#F8FAF8] px-4 text-sm font-medium text-[#6B7A70]">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#1a1f2e]">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>

                {editMode ? (
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-10 rounded-xl border-[#DFE7E1] bg-white text-sm focus-visible:ring-[#52B788]/30"
                  />
                ) : (
                  <div className="flex h-10 items-center rounded-xl border border-[#DFE7E1] bg-[#F8FAF8] px-4 text-sm font-medium text-[#1a1f2e]">
                    {user?.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#1a1f2e]">
                  <ShieldCheck className="h-4 w-4" />
                  Role
                </label>

                <div className="flex h-10 items-center rounded-xl border border-[#DFE7E1] bg-[#F8FAF8] px-4 text-sm font-medium text-[#1a1f2e]">
                  System Administrator
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#E2E8E3] bg-[#F8FAF8] p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E6F3EB] text-[#2D6A4F]">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#1a1f2e]">
                    Secure Admin Account
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#6B7A70]">
                    Keep your contact information updated to maintain secure
                    account access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}