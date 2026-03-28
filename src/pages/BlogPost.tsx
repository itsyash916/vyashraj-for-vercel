import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ReadingProgress from "@/components/ReadingProgress";
import CommentThread from "@/components/CommentThread";
import { ArrowLeft, Edit, Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      const [{ data: postData }, { count: likesCount }, { count: commentsCount }] = await Promise.all([
        supabase.from("blog_posts").select("*").eq("id", id).single(),
        supabase.from("blog_likes").select("*", { count: "exact", head: true }).eq("blog_id", id),
        supabase.from("blog_comments").select("*", { count: "exact", head: true }).eq("blog_id", id),
      ]);

      setPost(postData);
      setLikes(likesCount || 0);
      setCommentCount(commentsCount || 0);
    };

    const checkLiked = async () => {
      if (!user) return;
      const { data } = await supabase.from("blog_likes").select("id").eq("blog_id", id).eq("user_id", user.id);
      setLiked((data || []).length > 0);
    };

    fetchPost();
    checkLiked();
  }, [id, user]);

  const toggleLike = async () => {
    if (!user) { toast.error("Sign in to like posts"); return; }
    if (liked) {
      await supabase.from("blog_likes").delete().eq("blog_id", id).eq("user_id", user.id);
      setLikes((l) => l - 1);
    } else {
      await supabase.from("blog_likes").insert({ blog_id: id, user_id: user.id } as any);
      setLikes((l) => l + 1);
    }
    setLiked(!liked);
  };

  const deletePost = async () => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    navigate("/blog");
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied.");
  };

  if (!post) return <div className="min-h-screen bg-background"><Navbar /><div className="pt-32 flex justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div></div>;

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Navbar />
      <article className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-accent mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {post.cover_image_url && (
            <img src={post.cover_image_url} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8" />
          )}

          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-accent mb-8">
            <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
            <span>·</span>
            <span>{post.estimated_read_time} min read</span>
          </div>

          {isAdmin && (
            <div className="flex gap-3 mb-8">
              <Link to={`/blog/edit/${post.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-accent hover:bg-primary/20 transition-colors">
                <Edit className="w-3.5 h-3.5" /> Edit
              </Link>
              <button onClick={deletePost} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-accent hover:bg-destructive/20 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}

          <div
            className="prose prose-lg max-w-none font-body text-foreground/90 [&_img]:rounded-xl [&_img]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:italic [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_a]:text-primary mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="gold-divider w-full mb-8" />

          {/* Like, Comment, Share bar */}
          <div className="flex items-center gap-6 mb-12">
            <button onClick={toggleLike} className={`flex items-center gap-2 text-sm font-accent transition-colors ${liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}>
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} /> {likes}
            </button>
            <span className="flex items-center gap-2 text-sm text-muted-foreground font-accent">
              <MessageCircle className="w-5 h-5" /> {commentCount}
            </span>
            <button onClick={share} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-accent transition-colors">
              <Share2 className="w-5 h-5" /> Share
            </button>
          </div>

          {/* Comments */}
          <div>
            <h3 className="font-display text-xl font-bold text-foreground mb-6">Comments</h3>
            <CommentThread table="blog_comments" likesTable="blog_comment_likes" resourceField="blog_id" resourceId={id!} currentUser={user ? { id: user.id } : null} isAdmin={isAdmin} onCountChange={setCommentCount} />
          </div>
        </div>
      </article>

      <FooterSection />
    </div>
  );
};

export default BlogPost;
