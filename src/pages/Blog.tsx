import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Clock, Heart, MessageCircle, Plus } from "lucide-react";
import { format } from "date-fns";

const Blog = () => {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*, blog_likes(count), blog_comments(count)")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">Thoughts & Musings</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">The Blog</h1>
          </div>

          {isAdmin && (
            <div className="flex justify-end mb-8">
              <Link
                to="/blog/new"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-accent text-sm tracking-wider hover:bg-primary/90 transition-all"
              >
                <Plus className="w-4 h-4" /> New Post
              </Link>
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-card/50 border border-primary/10 h-72 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground font-body text-lg">No blog posts yet. Stay tuned!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group rounded-2xl bg-card/50 backdrop-blur border border-primary/10 hover:border-primary/25 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  {post.cover_image_url ? (
                    <div className="h-44 overflow-hidden">
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <span className="font-display text-3xl text-primary/30">{post.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                    {post.description && <p className="text-sm text-muted-foreground font-body mb-3 line-clamp-2">{post.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-accent">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.estimated_read_time} min</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.blog_likes?.[0]?.count || 0}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.blog_comments?.[0]?.count || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground/60 mt-2 font-accent">{format(new Date(post.created_at), "MMM d, yyyy")}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Blog;
