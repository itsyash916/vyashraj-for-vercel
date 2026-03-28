import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ProfileCard from "@/components/ProfileCard";
import RichTextEditor from "@/components/RichTextEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Plus, Trash2, Edit, User, BookOpen, Feather, Camera, MessageSquare, Send, Smile, Reply, Image as ImageIcon, Calendar, Maximize2, Minimize2, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

type EchoesTab = "poems" | "stories" | "chillin" | "chat";

const Echoes = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<EchoesTab>("poems");

  const tabs: { id: EchoesTab; label: string; icon: any }[] = [
    { id: "poems", label: "Poems", icon: Feather },
    { id: "stories", label: "Stories", icon: BookOpen },
    { id: "chillin", label: "Chillin", icon: Camera },
    { id: "chat", label: "Chat", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-card/60 backdrop-blur-2xl border border-primary/15 shadow-xl shadow-primary/5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-accent tracking-wider transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {activeTab === "poems" && <ContentTab type="poem" />}
          {activeTab === "stories" && <ContentTab type="story" />}
          {activeTab === "chillin" && <ChillinTab />}
          {activeTab === "chat" && <ChatTab />}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

// Card preview with expand on click
const ContentTab = ({ type }: { type: "poem" | "story" }) => {
  const { isAdmin, user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", scheduled_at: "" });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchPosts(); }, [type]);

  const fetchPosts = async () => {
    const { data } = await supabase.from("echoes_posts").select("*, echoes_likes(count), echoes_comments(count)")
      .eq("type", type).eq("published", true).order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const save = async () => {
    if (!form.title || !form.content) { toast.error("Fill in all fields"); return; }
    const { data: { user: u } } = await supabase.auth.getUser();
    const isScheduled = !!form.scheduled_at;
    const payload = {
      title: form.title, content: form.content, type,
      published: isScheduled ? false : true,
      scheduled_at: form.scheduled_at || null,
      author_id: u!.id,
    };
    if (editId) {
      const { error } = await supabase.from("echoes_posts").update(payload).eq("id", editId);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase.from("echoes_posts").insert(payload as any);
      if (error) { toast.error(error.message); return; }
    }
    setForm({ title: "", content: "", scheduled_at: "" });
    setShowEditor(false);
    setEditId(null);
    fetchPosts();
    toast.success(isScheduled ? "Scheduled!" : editId ? "Updated!" : "Published!");
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("echoes_posts").delete().eq("id", id);
    fetchPosts();
  };

  // Extract first image from HTML content for card preview
  const extractImage = (html: string) => {
    const match = html.match(/<img[^>]+src="([^"]+)"/);
    return match ? match[1] : null;
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div>
      {isAdmin && (
        <div className="flex justify-end mb-6">
          <button onClick={() => { setShowEditor(!showEditor); setEditId(null); setForm({ title: "", content: "", scheduled_at: "" }); }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-accent hover:bg-primary/90 transition-all">
            <Plus className="w-4 h-4" /> New {type === "poem" ? "Poem" : "Story"}
          </button>
        </div>
      )}

      {showEditor && (
        <div className="mb-8 p-6 rounded-2xl bg-card/50 backdrop-blur border border-primary/15">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary/50 outline-none font-display text-lg mb-4" placeholder="Title" />
          <RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} placeholder={`Write your ${type}...`} />
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button onClick={save} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-accent hover:bg-primary/90">{editId ? "Update" : form.scheduled_at ? "Schedule" : "Publish"}</button>
            <button onClick={() => setShowEditor(false)} className="px-6 py-2 rounded-xl border border-border text-sm font-accent hover:bg-primary/5">Cancel</button>
            <div className="flex items-center gap-2 ml-auto">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <input type="datetime-local" value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                className="px-3 py-1.5 rounded-lg bg-background/60 border border-border text-sm font-accent outline-none focus:border-primary/50" />
            </div>
          </div>
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const img = extractImage(post.content);
          const preview = stripHtml(post.content).substring(0, 120);
          return (
            <div key={post.id}
              onClick={() => setExpandedId(post.id)}
              className="cursor-pointer rounded-2xl bg-card/40 backdrop-blur border border-primary/10 overflow-hidden hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
              {img && (
                <div className="h-44 overflow-hidden">
                  <img src={img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-3">{preview}...</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-accent">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.echoes_likes?.[0]?.count || 0}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.echoes_comments?.[0]?.count || 0}</span>
                  <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {posts.length === 0 && <p className="text-center text-muted-foreground font-body text-lg py-16">No {type}s yet. Stay tuned!</p>}

      {/* Expanded Post Modal */}
      {expandedId && (
        <PostModal
          post={posts.find((p) => p.id === expandedId)}
          type={type}
          isAdmin={isAdmin}
          user={user}
          onClose={() => setExpandedId(null)}
          onEdit={(post: any) => { setEditId(post.id); setForm({ title: post.title, content: post.content, scheduled_at: "" }); setShowEditor(true); setExpandedId(null); }}
          onDelete={(id: string) => { del(id); setExpandedId(null); }}
          onRefresh={fetchPosts}
        />
      )}
    </div>
  );
};

// Full post modal
const PostModal = ({ post, type, isAdmin, user, onClose, onEdit, onDelete, onRefresh }: any) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post?.echoes_likes?.[0]?.count || 0);
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!post) return;
    fetchComments();
    if (user) {
      supabase.from("echoes_likes").select("id").eq("post_id", post.id).eq("user_id", user.id)
        .then(({ data }) => setLiked((data || []).length > 0));
    }
  }, [user, post?.id]);

  const fetchComments = async () => {
    if (!post) return;
    const { data } = await supabase.from("echoes_comments").select("*, profiles:user_id(display_name, avatar_url)")
      .eq("post_id", post.id).order("created_at", { ascending: true });
    setComments(data || []);
  };

  const toggleLike = async () => {
    if (!user) { toast.error("Sign in to like"); return; }
    if (liked) {
      await supabase.from("echoes_likes").delete().eq("post_id", post.id).eq("user_id", user.id);
      setLikes((l: number) => l - 1);
    } else {
      await supabase.from("echoes_likes").insert({ post_id: post.id, user_id: user.id } as any);
      setLikes((l: number) => l + 1);
    }
    setLiked(!liked);
  };

  const addComment = async () => {
    if (!user) { toast.error("Sign in to comment"); return; }
    if (!newComment.trim()) return;
    await supabase.from("echoes_comments").insert({ post_id: post.id, user_id: user.id, content: newComment } as any);
    setNewComment("");
    fetchComments();
  };

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-card border border-primary/15 rounded-2xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card/90 backdrop-blur">
          <h2 className="font-display text-xl font-bold text-foreground">{post.title}</h2>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button onClick={() => onEdit(post)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(post.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground"><Trash2 className="w-4 h-4" /></button>
              </>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="p-6">
          <div className={`font-body text-foreground/80 text-sm leading-relaxed ${type === "poem" ? "whitespace-pre-line italic" : ""} [&_img]:rounded-lg [&_img]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-3 [&_blockquote]:italic`}
            dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border/50">
            <button onClick={toggleLike} className={`flex items-center gap-1.5 text-xs font-accent ${liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}>
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} /> {likes}
            </button>
            <button onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-accent">
              <MessageCircle className="w-4 h-4" /> {comments.length}
            </button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-accent">
              <Share2 className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground/60 ml-auto font-accent">{format(new Date(post.created_at), "MMM d, yyyy")}</span>
          </div>

          {showComments && (
            <div className="mt-4 space-y-3">
              {user && (
                <div className="flex gap-2">
                  <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 rounded-lg bg-background/60 border border-border text-sm font-body outline-none focus:border-primary/50"
                    onKeyDown={(e) => e.key === "Enter" && addComment()} />
                  <button onClick={addComment} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-accent">Post</button>
                </div>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <Avatar className="w-6 h-6 mt-0.5">
                    <AvatarImage src={c.profiles?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs"><User className="w-3 h-3" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-xs font-accent font-medium text-foreground">{c.profiles?.display_name || "Anon"}</span>
                    <p className="text-xs text-foreground/70 font-body">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Chillin Tab - Instagram-style scrolling feed
const ChillinTab = () => {
  const { isAdmin, user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from("echoes_posts").select("*, echoes_likes(count), echoes_comments(count)")
      .eq("type", "chillin").eq("published", true).order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const uploadPost = async (file: File) => {
    setUploading(true);
    const path = `chillin/${Date.now()}-${file.name}`;
    await supabase.storage.from("media").upload(path, file);
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    const { data: { user: u } } = await supabase.auth.getUser();
    const isScheduled = !!scheduledAt;
    await supabase.from("echoes_posts").insert({
      type: "chillin", media_url: publicUrl, media_type: mediaType, content: caption,
      published: isScheduled ? false : true,
      scheduled_at: scheduledAt || null,
      author_id: u!.id,
    } as any);
    setCaption("");
    setScheduledAt("");
    setShowUpload(false);
    setUploading(false);
    fetchPosts();
    toast.success(isScheduled ? "Scheduled!" : "Posted!");
  };

  return (
    <div>
      {isAdmin && (
        <div className="flex justify-end mb-6">
          <button onClick={() => setShowUpload(!showUpload)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-accent hover:bg-primary/90">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
      )}

      {showUpload && (
        <div className="mb-8 p-6 rounded-2xl bg-card/50 backdrop-blur border border-primary/15">
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..."
            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary/50 outline-none font-body text-sm mb-4" rows={2} />
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-accent cursor-pointer hover:bg-primary/90">
              <ImageIcon className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Image/Video"}
              <input type="file" accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && uploadPost(e.target.files[0])} className="hidden" />
            </label>
            <div className="flex items-center gap-2 ml-auto">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <input type="datetime-local" value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-background/60 border border-border text-sm font-accent outline-none focus:border-primary/50" />
            </div>
          </div>
        </div>
      )}

      {/* Instagram-style feed */}
      <div className="max-w-lg mx-auto space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="rounded-2xl bg-card/40 backdrop-blur border border-primary/10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-accent text-sm font-semibold text-foreground">V.Yash.Raj</span>
              <span className="text-xs text-muted-foreground ml-auto font-accent">{format(new Date(post.created_at), "MMM d")}</span>
              {isAdmin && (
                <button onClick={async () => { await supabase.from("echoes_posts").delete().eq("id", post.id); fetchPosts(); }}
                  className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              )}
            </div>
            {/* Media */}
            {post.media_type === "video" ? (
              <video src={post.media_url} controls className="w-full aspect-[4/5] object-cover" />
            ) : post.media_url ? (
              <img src={post.media_url} alt="" className="w-full aspect-[4/5] object-cover" />
            ) : null}
            {/* Actions */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-4 mb-2">
                <span className="flex items-center gap-1 text-sm text-muted-foreground font-accent">
                  <Heart className="w-5 h-5" /> {post.echoes_likes?.[0]?.count || 0}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground font-accent">
                  <MessageCircle className="w-5 h-5" /> {post.echoes_comments?.[0]?.count || 0}
                </span>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                  className="text-muted-foreground hover:text-primary ml-auto">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              {post.content && <p className="text-sm text-foreground/80 font-body">{post.content}</p>}
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && <p className="text-center text-muted-foreground font-body text-lg py-16">Nothing here yet. Check back soon!</p>}
    </div>
  );
};

// Chat Tab with fullscreen, edit, delete
const ChatTab = () => {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [replyTo, setReplyTo] = useState<any>(null);
  const [showEmoji, setShowEmoji] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const emojis = ["❤️", "😂", "🔥", "👏", "😍", "🙌", "💯", "✨"];

  useEffect(() => {
    if (!user) return;
    fetchMessages();

    const channel = supabase.channel("chat")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages" }, () => fetchMessages())
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_reactions" }, () => fetchMessages())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase.from("chat_messages")
      .select("*, profiles:user_id(display_name, avatar_url), reply:reply_to_id(content, profiles:user_id(display_name)), chat_reactions(emoji, user_id)")
      .order("created_at", { ascending: true }).limit(100);
    setMessages(data || []);
  };

  const sendMessage = async (mediaUrl?: string, mediaType?: string) => {
    if (!user) return;
    if (!newMsg.trim() && !mediaUrl) return;
    const { error } = await supabase.from("chat_messages").insert({
      user_id: user.id, content: newMsg || null, media_url: mediaUrl || null, media_type: mediaType || null,
      reply_to_id: replyTo?.id || null,
    } as any);
    if (error) { toast.error("Failed to send: " + error.message); return; }
    setNewMsg("");
    setReplyTo(null);
  };

  const editMessage = async (id: string) => {
    if (!editText.trim()) return;
    const { error } = await supabase.from("chat_messages").update({ content: editText }).eq("id", id);
    if (error) { toast.error("Edit failed: " + error.message); return; }
    setEditingId(null);
    setEditText("");
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("chat_messages").delete().eq("id", id);
    fetchMessages();
  };

  const react = async (msgId: string, emoji: string) => {
    if (!user) return;
    const existing = messages.find((m) => m.id === msgId)?.chat_reactions?.find((r: any) => r.user_id === user.id && r.emoji === emoji);
    if (existing) {
      await supabase.from("chat_reactions").delete().eq("message_id", msgId).eq("user_id", user.id).eq("emoji", emoji);
    } else {
      await supabase.from("chat_reactions").insert({ message_id: msgId, user_id: user.id, emoji } as any);
    }
    setShowEmoji(null);
  };

  const uploadMedia = async (file: File) => {
    const path = `chat/${Date.now()}-${file.name}`;
    await supabase.storage.from("media").upload(path, file);
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
    const type = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : "gif";
    await sendMessage(publicUrl, type);
  };

  if (!user) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground font-body text-lg mb-4">Sign in to join the chat</p>
      <a href="/auth" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-accent hover:bg-primary/90 transition-all inline-block">Sign In</a>
    </div>
  );

  const chatContent = (
    <div className={`rounded-2xl bg-card/30 backdrop-blur border border-primary/10 overflow-hidden ${isFullscreen ? "fixed inset-0 z-[80] rounded-none" : ""}`}
      style={isFullscreen ? {} : { height: "calc(100vh - 220px)" }}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-foreground">Community Chat</h3>
            <p className="text-xs text-muted-foreground font-accent">Everyone can chat here</p>
          </div>
          <button onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground transition-colors">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const canEdit = msg.user_id === user.id || isAdmin;
            const canDelete = msg.user_id === user.id || isAdmin;
            return (
              <div key={msg.id} className="group flex items-start gap-3 hover:bg-primary/5 rounded-lg p-2 -mx-2 transition-colors relative">
                <Avatar className="w-8 h-8 mt-0.5 shrink-0">
                  <AvatarImage src={msg.profiles?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs"><User className="w-3 h-3" /></AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-accent font-semibold text-foreground">{msg.profiles?.display_name || "Anon"}</span>
                    <span className="text-[10px] text-muted-foreground">{format(new Date(msg.created_at), "h:mm a")}</span>
                  </div>
                  {msg.reply && (
                    <div className="text-xs text-muted-foreground bg-primary/5 rounded px-2 py-1 mb-1 border-l-2 border-primary/30">
                      <span className="font-medium">{msg.reply.profiles?.display_name}</span>: {msg.reply.content?.substring(0, 50)}
                    </div>
                  )}
                  {editingId === msg.id ? (
                    <div className="flex gap-2 mt-1">
                      <input value={editText} onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-background/60 border border-primary/30 text-sm font-body outline-none"
                        onKeyDown={(e) => e.key === "Enter" && editMessage(msg.id)} autoFocus />
                      <button onClick={() => editMessage(msg.id)} className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-xs px-2 py-1 rounded border border-border">Cancel</button>
                    </div>
                  ) : (
                    msg.content && <p className="text-sm text-foreground/80 font-body break-words">{msg.content}</p>
                  )}
                  {msg.media_url && (
                    msg.media_type === "video" ? <video src={msg.media_url} controls className="max-w-[300px] rounded-lg mt-1" />
                    : <img src={msg.media_url} alt="" className="max-w-[300px] rounded-lg mt-1" />
                  )}
                  {msg.chat_reactions && msg.chat_reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(
                        msg.chat_reactions.reduce((acc: any, r: any) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1; return acc;
                        }, {})
                      ).map(([emoji, count]) => (
                        <button key={emoji} onClick={() => react(msg.id, emoji)}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-xs hover:bg-primary/20 transition-colors">
                          {emoji} <span className="text-muted-foreground">{count as number}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity shrink-0">
                  <button onClick={() => setReplyTo(msg)} className="p-1 rounded hover:bg-primary/10 text-muted-foreground"><Reply className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setShowEmoji(showEmoji === msg.id ? null : msg.id)} className="p-1 rounded hover:bg-primary/10 text-muted-foreground"><Smile className="w-3.5 h-3.5" /></button>
                  {canEdit && (
                    <button onClick={() => { setEditingId(msg.id); setEditText(msg.content || ""); }} className="p-1 rounded hover:bg-primary/10 text-muted-foreground"><Edit className="w-3.5 h-3.5" /></button>
                  )}
                  {canDelete && (
                    <button onClick={() => deleteMessage(msg.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
                {showEmoji === msg.id && (
                  <div className="absolute right-0 top-8 bg-card border border-border rounded-xl p-2 shadow-xl flex gap-1 z-10">
                    {emojis.map((e) => <button key={e} onClick={() => react(msg.id, e)} className="text-lg hover:scale-125 transition-transform">{e}</button>)}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-border">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground bg-primary/5 rounded-lg px-3 py-1.5">
              <Reply className="w-3 h-3" /> Replying to {replyTo.profiles?.display_name}
              <button onClick={() => setReplyTo(null)} className="ml-auto text-muted-foreground hover:text-foreground">✕</button>
            </div>
          )}
          <div className="flex gap-2">
            <label className="p-2.5 rounded-xl border border-border hover:bg-primary/5 cursor-pointer transition-colors">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <input type="file" accept="image/*,video/*,.gif" onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0])} className="hidden" />
            </label>
            <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-background/60 border border-border focus:border-primary/50 outline-none font-body text-sm" />
            <button onClick={() => sendMessage()} className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return chatContent;
};

export default Echoes;
