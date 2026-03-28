import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Heart, MessageCircle, Reply, Send, Trash2, User, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchProfilesMap, type ProfileSummary } from "@/lib/profileLookup";

type CommentTable = "blog_comments" | "echoes_comments";
type CommentLikesTable = "blog_comment_likes" | "echoes_comment_likes";
type ResourceField = "blog_id" | "post_id";

type CommentThreadProps = {
  table: CommentTable;
  likesTable: CommentLikesTable;
  resourceField: ResourceField;
  resourceId: string;
  currentUser: { id: string } | null;
  isAdmin: boolean;
  onCountChange?: (count: number) => void;
  compact?: boolean;
};

type EnrichedComment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_comment_id: string | null;
  profile: ProfileSummary | null;
  likesCount: number;
  likedByCurrentUser: boolean;
  replies: EnrichedComment[];
};

const CommentThread = ({ table, likesTable, resourceField, resourceId, currentUser, isAdmin, onCountChange, compact = false }: CommentThreadProps) => {
  const [comments, setComments] = useState<EnrichedComment[]>([]);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<EnrichedComment | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from(table as any)
      .select("*")
      .eq(resourceField, resourceId)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Could not load comments right now.");
      setComments([]);
      setLoading(false);
      onCountChange?.(0);
      return;
    }

    const rawComments = (data ?? []) as any[];
    onCountChange?.(rawComments.length);

    const commentIds = rawComments.map((comment) => comment.id);
    const userIds = rawComments.map((comment) => comment.user_id);

    const [profilesMap, likesResult] = await Promise.all([
      fetchProfilesMap(userIds),
      commentIds.length
        ? supabase.from(likesTable as any).select("comment_id, user_id").in("comment_id", commentIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    const likeRows = ((likesResult.data as any[]) ?? []);
    const likeCounts = likeRows.reduce<Record<string, number>>((acc, like) => {
      acc[like.comment_id] = (acc[like.comment_id] ?? 0) + 1;
      return acc;
    }, {});

    const currentUserLikes = new Set(likeRows.filter((like) => like.user_id === currentUser?.id).map((like) => like.comment_id));

    const enriched = rawComments.map((comment) => ({
      ...comment,
      profile: profilesMap[comment.user_id] ?? null,
      likesCount: likeCounts[comment.id] ?? 0,
      likedByCurrentUser: currentUserLikes.has(comment.id),
      replies: [],
    })) as EnrichedComment[];

    setComments(enriched);
    setLoading(false);
  }, [currentUser?.id, likesTable, onCountChange, resourceField, resourceId, table]);

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel(`comments:${table}:${resourceId}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, fetchComments)
      .on("postgres_changes", { event: "*", schema: "public", table: likesTable }, fetchComments)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchComments, likesTable, resourceId, table]);

  const commentTree = useMemo(() => {
    const byId = new Map<string, EnrichedComment>();
    const roots: EnrichedComment[] = [];

    comments.forEach((comment) => {
      byId.set(comment.id, { ...comment, replies: [] });
    });

    byId.forEach((comment) => {
      if (comment.parent_comment_id && byId.has(comment.parent_comment_id)) {
        byId.get(comment.parent_comment_id)?.replies.push(comment);
      } else {
        roots.push(comment);
      }
    });

    return roots;
  }, [comments]);

  const postComment = async () => {
    if (!currentUser) {
      toast.error("Sign in to comment.");
      return;
    }

    if (!draft.trim()) return;

    const payload = {
      [resourceField]: resourceId,
      user_id: currentUser.id,
      content: draft.trim(),
      parent_comment_id: replyTo?.id ?? null,
    };

    const { error } = await supabase.from(table as any).insert(payload as any);

    if (error) {
      toast.error(error.message);
      return;
    }

    setDraft("");
    setReplyTo(null);
    await fetchComments();
  };

  const updateComment = async (commentId: string) => {
    if (!editDraft.trim()) return;

    const { error } = await supabase.from(table as any).update({ content: editDraft.trim() }).eq("id", commentId);

    if (error) {
      toast.error(error.message);
      return;
    }

    setEditingId(null);
    setEditDraft("");
    await fetchComments();
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    const { error } = await supabase.from(table as any).delete().eq("id", commentId);

    if (error) {
      toast.error(error.message);
      return;
    }

    await fetchComments();
  };

  const toggleLike = async (comment: EnrichedComment) => {
    if (!currentUser) {
      toast.error("Sign in to like comments.");
      return;
    }

    const query = supabase.from(likesTable as any);

    const response = comment.likedByCurrentUser
      ? await query.delete().eq("comment_id", comment.id).eq("user_id", currentUser.id)
      : await query.insert({ comment_id: comment.id, user_id: currentUser.id } as any);

    if (response.error) {
      toast.error(response.error.message);
      return;
    }

    await fetchComments();
  };

  const renderComment = (comment: EnrichedComment, depth = 0) => {
    const canManage = currentUser?.id === comment.user_id || isAdmin;

    return (
      <div key={comment.id} className={depth > 0 ? "mt-3 pl-4 border-l border-border/60" : ""}>
        <div className={`rounded-2xl border border-border/60 bg-card/40 ${compact ? "p-3" : "p-4"}`}>
          <div className="flex items-start gap-3">
            <Avatar className={compact ? "w-8 h-8" : "w-9 h-9"}>
              <AvatarImage src={comment.profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                <span className="text-sm font-accent font-semibold text-foreground">{comment.profile?.display_name || "Anonymous"}</span>
                <span className="text-[11px] text-muted-foreground">{format(new Date(comment.created_at), compact ? "MMM d · h:mm a" : "MMMM d, yyyy · h:mm a")}</span>
              </div>

              {editingId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editDraft}
                    onChange={(event) => setEditDraft(event.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-border bg-background/70 px-3 py-2 text-sm font-body outline-none focus:border-primary/50"
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateComment(comment.id)} className="rounded-xl bg-primary px-3 py-1.5 text-xs font-accent text-primary-foreground transition-all hover:bg-primary/90">Save</button>
                    <button onClick={() => { setEditingId(null); setEditDraft(""); }} className="rounded-xl border border-border px-3 py-1.5 text-xs font-accent text-muted-foreground transition-all hover:bg-primary/5">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-foreground/80 font-body whitespace-pre-wrap">{comment.content}</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-accent text-muted-foreground">
                <button onClick={() => toggleLike(comment)} className={`inline-flex items-center gap-1 transition-colors hover:text-primary ${comment.likedByCurrentUser ? "text-primary" : ""}`}>
                  <Heart className={`w-3.5 h-3.5 ${comment.likedByCurrentUser ? "fill-current" : ""}`} />
                  {comment.likesCount}
                </button>
                <button onClick={() => setReplyTo(comment)} className="inline-flex items-center gap-1 transition-colors hover:text-primary">
                  <Reply className="w-3.5 h-3.5" /> Reply
                </button>
                {canManage && editingId !== comment.id && (
                  <button onClick={() => { setEditingId(comment.id); setEditDraft(comment.content); }} className="inline-flex items-center gap-1 transition-colors hover:text-primary">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
                {canManage && (
                  <button onClick={() => deleteComment(comment.id)} className="inline-flex items-center gap-1 transition-colors hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
                {comment.replies.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-muted-foreground/80">
                    <MessageCircle className="w-3.5 h-3.5" /> {comment.replies.length} replies
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {comment.replies.map((reply) => renderComment(reply, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {currentUser ? (
        <div className="rounded-2xl border border-primary/15 bg-card/40 p-4">
          {replyTo && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-xs font-accent text-muted-foreground">
              <Reply className="w-3.5 h-3.5 text-primary" />
              Replying to <span className="text-foreground">{replyTo.profile?.display_name || "Anonymous"}</span>
              <button onClick={() => setReplyTo(null)} className="ml-auto text-muted-foreground transition-colors hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={compact ? 2 : 3}
              placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
              className="flex-1 resize-none rounded-xl border border-border bg-background/70 px-4 py-3 text-sm font-body outline-none focus:border-primary/50"
            />
            <button onClick={postComment} className="self-end rounded-xl bg-primary px-4 py-3 text-primary-foreground transition-all hover:bg-primary/90">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card/30 p-4 text-sm font-body text-muted-foreground">Sign in to comment, reply, and like comments.</div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-border/60 bg-card/30 p-4 text-sm font-body text-muted-foreground">Loading comments...</div>
      ) : commentTree.length > 0 ? (
        <div className="space-y-3">{commentTree.map((comment) => renderComment(comment))}</div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card/30 p-4 text-sm font-body text-muted-foreground">No comments yet — be the first to say something.</div>
      )}
    </div>
  );
};

export default CommentThread;