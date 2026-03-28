import { useEffect, useState } from "react";
import { Calendar, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const toDateTimeLocalValue = (iso: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
};

const AdminSiteSettingsCard = () => {
  const [countdownTitle, setCountdownTitle] = useState("Launch");
  const [countdownTarget, setCountdownTarget] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("countdown_title, countdown_target").eq("id", "global").maybeSingle().then(({ data }) => {
      if (data?.countdown_title) setCountdownTitle(data.countdown_title);
      if (data?.countdown_target) setCountdownTarget(toDateTimeLocalValue(data.countdown_target));
    });
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({
      id: "global",
      countdown_title: countdownTitle.trim() || "Launch",
      countdown_target: countdownTarget ? new Date(countdownTarget).toISOString() : null,
    } as any);
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Countdown settings saved.");
  };

  return (
    <div className="mt-8 rounded-3xl border border-primary/15 bg-card/50 p-6 shadow-xl shadow-primary/5 backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-xs tracking-[0.3em] uppercase text-primary font-accent mb-2">Home Countdown</p>
        <h3 className="text-2xl font-display font-bold text-foreground">Control the launch section</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-[1.1fr_1fr_auto] md:items-end">
        <div className="space-y-2">
          <label className="text-sm font-accent text-foreground/80">Title</label>
          <input value={countdownTitle} onChange={(event) => setCountdownTitle(event.target.value)} className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm font-body outline-none focus:border-primary/50" />
        </div>
        <div className="space-y-2">
          <label className="inline-flex items-center gap-2 text-sm font-accent text-foreground/80"><Calendar className="w-4 h-4 text-primary" /> Target date & time</label>
          <input type="datetime-local" value={countdownTarget} onChange={(event) => setCountdownTarget(event.target.value)} className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm font-body outline-none focus:border-primary/50" />
        </div>
        <button onClick={saveSettings} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-accent text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AdminSiteSettingsCard;