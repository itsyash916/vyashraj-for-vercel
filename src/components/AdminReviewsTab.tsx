import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminReviewsTab = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [form, setForm] = useState({ quote: "", name: "", detail: "" });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews((data as any) || []);
  };

  const save = async () => {
    if (!form.quote || !form.name) { toast.error("Quote and name required"); return; }
    if (editId) {
      await supabase.from("reviews").update(form as any).eq("id", editId);
    } else {
      await supabase.from("reviews").insert(form as any);
    }
    setForm({ quote: "", name: "", detail: "" });
    setShowForm(false);
    setEditId(null);
    fetchReviews();
    toast.success(editId ? "Updated!" : "Added!");
  };

  const del = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    fetchReviews();
  };

  return (
    <div>
      <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ quote: "", name: "", detail: "" }); }}
        className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-accent hover:bg-primary/90">
        <Plus className="w-4 h-4" /> New Review
      </button>

      {showForm && (
        <div className="mb-6 p-6 rounded-2xl bg-card/50 border border-primary/15 space-y-4">
          <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border outline-none font-body text-sm" rows={3} placeholder="Review quote" />
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border outline-none font-accent" placeholder="Reviewer name" />
          <input value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border outline-none font-accent text-sm" placeholder="Detail (e.g. Poetry Enthusiast)" />
          <div className="flex gap-3">
            <button onClick={save} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-accent">{editId ? "Update" : "Add"}</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl border border-border text-sm font-accent">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-foreground/80 italic truncate">"{r.quote}"</p>
              <p className="text-xs text-muted-foreground font-accent mt-1">{r.name} · {r.detail}</p>
            </div>
            <button onClick={() => { setEditId(r.id); setForm({ quote: r.quote, name: r.name, detail: r.detail }); setShowForm(true); }}
              className="text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
            <button onClick={() => del(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviewsTab;
