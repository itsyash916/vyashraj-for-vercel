import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Users, FileText, Feather, Image, Bell, BarChart3, Calendar, Trash2, Edit, Eye, EyeOff, Plus, Star } from "lucide-react";
import AdminReviewsTab from "@/components/AdminReviewsTab";
import AdminSiteSettingsCard from "@/components/AdminSiteSettingsCard";
import { format } from "date-fns";
import { toast } from "sonner";

type AdminTab = "overview" | "blogs" | "echoes" | "notifications" | "users" | "reviews";

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("overview");

  useEffect(() => { if (!isAdmin) navigate("/"); }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const tabs: { id: AdminTab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "blogs", label: "Blogs", icon: FileText },
    { id: "echoes", label: "Echoes", icon: Feather },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "users", label: "Users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">Admin Panel</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-accent transition-all ${
                  tab === t.id ? "bg-primary text-primary-foreground" : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card"
                }`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {tab === "overview" && <OverviewTab />}
          {tab === "blogs" && <BlogsTab />}
          {tab === "echoes" && <EchoesTab />}
          {tab === "notifications" && <NotificationsTab />}
          {tab === "reviews" && <AdminReviewsTab />}
          {tab === "users" && <UsersTab />}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

const OverviewTab = () => {
  const [stats, setStats] = useState({ users: 0, blogs: 0, poems: 0, stories: 0, comments: 0, contacts: 0 });

  useEffect(() => {
    const fetch = async () => {
      const [u, b, p, s, bc, cs] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("echoes_posts").select("*", { count: "exact", head: true }).eq("type", "poem"),
        supabase.from("echoes_posts").select("*", { count: "exact", head: true }).eq("type", "story"),
        supabase.from("blog_comments").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
      ]);
      setStats({ users: u.count || 0, blogs: b.count || 0, poems: p.count || 0, stories: s.count || 0, comments: bc.count || 0, contacts: cs.count || 0 });
    };
    fetch();
  }, []);

  const cards = [
    { label: "Users", value: stats.users, icon: Users },
    { label: "Blog Posts", value: stats.blogs, icon: FileText },
    { label: "Poems", value: stats.poems, icon: Feather },
    { label: "Stories", value: stats.stories, icon: FileText },
    { label: "Comments", value: stats.comments, icon: FileText },
    { label: "Contact Messages", value: stats.contacts, icon: FileText },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="p-6 rounded-2xl bg-card/50 backdrop-blur border border-primary/10">
            <c.icon className="w-5 h-5 text-primary mb-3" />
            <p className="text-2xl font-display font-bold text-foreground">{c.value}</p>
            <p className="text-sm text-muted-foreground font-accent">{c.label}</p>
          </div>
        ))}
      </div>
      <AdminSiteSettingsCard />
    </div>
  );
};

const BlogsTab = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false }).then(({ data }) => setPosts(data || []));
  }, []);

  const toggle = async (id: string, published: boolean) => {
    await supabase.from("blog_posts").update({ published: !published }).eq("id", id);
    setPosts(posts.map((p) => p.id === id ? { ...p, published: !published } : p));
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div>
      <button onClick={() => navigate("/blog/new")} className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-accent hover:bg-primary/90">
        <Plus className="w-4 h-4" /> New Post
      </button>
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex-1 min-w-0">
              <p className="font-accent font-medium text-foreground truncate">{p.title}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy")} {p.scheduled_at && `· Scheduled: ${format(new Date(p.scheduled_at), "MMM d")}`}</p>
            </div>
            <button onClick={() => toggle(p.id, p.published)} className="text-muted-foreground hover:text-primary">{p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
            <button onClick={() => navigate(`/blog/edit/${p.id}`)} className="text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
            <button onClick={() => del(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const EchoesTab = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("echoes_posts").select("*").order("created_at", { ascending: false }).then(({ data }) => setPosts(data || []));
  }, []);

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("echoes_posts").delete().eq("id", id);
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-3">
      {posts.map((p) => (
        <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
          <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-accent capitalize">{p.type}</span>
          <div className="flex-1 min-w-0">
            <p className="font-accent font-medium text-foreground truncate">{p.title || p.content?.substring(0, 50) || "Media post"}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy")}</p>
          </div>
          <button onClick={() => del(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  );
};

const NotificationsTab = () => {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", content: "", image_url: "", published: true, scheduled_at: "" });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { fetchNotifs(); }, []);

  const fetchNotifs = async () => {
    // Admin can see all — but RLS only allows published for non-admin, so we query all
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
    setNotifs(data || []);
  };

  const save = async () => {
    if (!form.title || !form.content) { toast.error("Title and content required"); return; }
    const payload = { ...form, scheduled_at: form.scheduled_at || null, published: form.scheduled_at ? false : form.published };
    if (editId) {
      await supabase.from("notifications").update(payload).eq("id", editId);
    } else {
      await supabase.from("notifications").insert(payload as any);
    }
    setForm({ title: "", content: "", image_url: "", published: true, scheduled_at: "" });
    setShowForm(false);
    setEditId(null);
    fetchNotifs();
    toast.success(editId ? "Updated!" : "Created!");
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("notifications").delete().eq("id", id);
    fetchNotifs();
  };

  return (
    <div>
      <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: "", content: "", image_url: "", published: true, scheduled_at: "" }); }}
        className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-accent hover:bg-primary/90">
        <Plus className="w-4 h-4" /> New Notification
      </button>

      {showForm && (
        <div className="mb-6 p-6 rounded-2xl bg-card/50 border border-primary/15 space-y-4">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border outline-none font-accent" placeholder="Title" />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border outline-none font-body text-sm" rows={3} placeholder="Content" />
          <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border outline-none font-accent text-sm" placeholder="Image URL (optional)" />
          <input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border outline-none font-accent text-sm" />
          <div className="flex gap-3">
            <button onClick={save} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-accent">{editId ? "Update" : "Create"}</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl border border-border text-sm font-accent">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {notifs.map((n) => (
          <div key={n.id} className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex-1">
              <p className="font-accent font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.published ? "Published" : "Draft"} · {format(new Date(n.created_at), "MMM d, yyyy")}</p>
            </div>
            <button onClick={() => { setEditId(n.id); setForm({ title: n.title, content: n.content, image_url: n.image_url || "", published: n.published, scheduled_at: n.scheduled_at || "" }); setShowForm(true); }}
              className="text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
            <button onClick={() => del(n.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsersTab = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => setUsers(data || []));
  }, []);

  return (
    <div className="space-y-3">
      {users.map((u) => (
        <div key={u.id} className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
          {u.avatar_url && <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />}
          <div className="flex-1">
            <p className="font-accent font-medium text-foreground">{u.display_name || "No name"}</p>
            <p className="text-xs text-muted-foreground">Joined {format(new Date(u.created_at), "MMM d, yyyy")}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
