import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ display_name: "", bio: "", email_visible: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    if (profile) {
      setForm({ display_name: profile.display_name || "", bio: profile.bio || "", email_visible: profile.email_visible });
    }
  }, [user, profile, navigate]);

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const path = `${user.id}/${Date.now()}-avatar`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
    refreshProfile();
    toast.success("Avatar updated!");
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update(form).eq("user_id", user.id);
    await refreshProfile();
    setSaving(false);
    toast.success("Profile saved!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8 text-center">Your Profile</h1>

          <div className="p-8 rounded-2xl bg-card/40 backdrop-blur-xl border border-primary/15 shadow-xl space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary"><User className="w-10 h-10" /></AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 rounded-full bg-foreground/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <Upload className="w-6 h-6 text-background" />
                  <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
                </label>
              </div>
              <p className="text-sm text-muted-foreground font-accent">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-accent text-foreground/70 mb-2 block">Display Name</label>
              <input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary/50 outline-none font-body" placeholder="Your name" />
            </div>

            <div>
              <label className="text-sm font-accent text-foreground/70 mb-2 block">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary/50 outline-none font-body text-sm resize-none" rows={3} placeholder="Tell us about yourself" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setForm({ ...form, email_visible: !form.email_visible })}
                className={`w-10 h-6 rounded-full transition-colors relative ${form.email_visible ? "bg-primary" : "bg-border"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform ${form.email_visible ? "left-[18px]" : "left-0.5"}`} />
              </button>
              <span className="text-sm font-accent text-foreground/70 flex items-center gap-1.5">
                {form.email_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {form.email_visible ? "Email visible to others" : "Email hidden from others"}
              </span>
            </label>

            <button onClick={saveProfile} disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-accent text-sm tracking-wider hover:bg-primary/90 transition-all disabled:opacity-60">
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Profile;
