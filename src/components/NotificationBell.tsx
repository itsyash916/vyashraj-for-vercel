import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchNotifications = async () => {
    const { data: notifs } = await supabase
      .from("notifications")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (notifs) {
      setNotifications(notifs);
      const { data: reads } = await supabase
        .from("notification_reads")
        .select("notification_id")
        .eq("user_id", user!.id);
      const readIds = new Set(reads?.map((r: any) => r.notification_id) || []);
      setUnreadCount(notifs.filter((n: any) => !readIds.has(n.id)).length);
    }
  };

  const markAllRead = async () => {
    if (!user || notifications.length === 0) return;
    const inserts = notifications.map((n: any) => ({
      notification_id: n.id,
      user_id: user.id,
    }));
    await supabase.from("notification_reads").upsert(inserts as any, { onConflict: "notification_id,user_id" });
    setUnreadCount(0);
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="relative w-9 h-9 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-all"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto rounded-2xl bg-card/95 backdrop-blur-xl border border-primary/15 shadow-2xl z-50 animate-fade-in">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-semibold text-foreground">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground font-accent text-center">No notifications yet</p>
          ) : (
            notifications.map((n: any) => (
              <div key={n.id} className="p-4 border-b border-border/50 hover:bg-primary/5 transition-colors">
                {n.image_url && <img src={n.image_url} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />}
                <p className="font-accent font-medium text-sm text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-1 font-body">{n.content}</p>
                <p className="text-xs text-muted-foreground/60 mt-2 font-accent">{format(new Date(n.created_at), "MMM d, yyyy")}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
