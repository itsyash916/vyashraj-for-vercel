import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import RichTextEditor from "@/components/RichTextEditor";
import { toast } from "sonner";
import { ArrowLeft, Upload, Calendar } from "lucide-react";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "", description: "", content: "", cover_image_url: "", estimated_read_time: 5, published: true, scheduled_at: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate("/blog"); return; }
    if (isEdit) {
      supabase.from("blog_posts").select("*").eq("id", id).single().then(({ data }) => {
        if (data) setForm({
          title: data.title, description: data.description || "", content: data.content,
          cover_image_url: data.cover_image_url || "", estimated_read_time: data.estimated_read_time || 5,
          published: data.published, scheduled_at: data.scheduled_at || "",
        });
      });
    }
  }, [id, isAdmin, isEdit, navigate]);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `covers/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) { toast.error("Upload failed"); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(path);
    setForm({ ...form, cover_image_url: publicUrl });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) { toast.error("Title and content required"); return; }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      ...form,
      author_id: user!.id,
      scheduled_at: form.scheduled_at || null,
      published: form.scheduled_at ? false : form.published,
    };

    if (isEdit) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
      if (error) toast.error(error.message); else { toast.success("Post updated!"); navigate(`/blog/${id}`); }
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload as any);
      if (error) toast.error(error.message); else { toast.success("Post published!"); navigate("/blog"); }
    }
    setSaving(false);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate("/blog")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-accent mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </button>

          <h1 className="text-3xl font-display font-bold text-foreground mb-8">{isEdit ? "Edit Post" : "New Blog Post"}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-accent text-foreground/70 mb-2 block">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border focus:border-primary/50 outline-none font-display text-xl" placeholder="Post title" />
            </div>

            <div>
              <label className="text-sm font-accent text-foreground/70 mb-2 block">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border focus:border-primary/50 outline-none font-body text-sm resize-none" rows={2} placeholder="Brief description" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-accent text-foreground/70 mb-2 block">Estimated Read Time (minutes)</label>
                <input type="number" min={1} value={form.estimated_read_time}
                  onChange={(e) => setForm({ ...form, estimated_read_time: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border focus:border-primary/50 outline-none font-accent" />
              </div>
              <div>
                <label className="text-sm font-accent text-foreground/70 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Schedule (optional)</label>
                <input type="datetime-local" value={form.scheduled_at}
                  onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border focus:border-primary/50 outline-none font-accent text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm font-accent text-foreground/70 mb-2 block">Cover Image</label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border hover:border-primary/30 cursor-pointer font-accent text-sm transition-colors">
                  <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
                </label>
                {form.cover_image_url && <img src={form.cover_image_url} alt="Cover" className="w-20 h-20 object-cover rounded-lg" />}
              </div>
            </div>

            <div>
              <label className="text-sm font-accent text-foreground/70 mb-2 block">Content</label>
              <RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 font-accent text-sm">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-border" />
                Publish immediately
              </label>
            </div>

            <button type="submit" disabled={saving}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-accent text-sm tracking-wider hover:bg-primary/90 transition-all disabled:opacity-60">
              {saving ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
            </button>
          </form>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default BlogEditor;
