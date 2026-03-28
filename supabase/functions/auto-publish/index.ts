import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const now = new Date().toISOString();

    // Auto-publish scheduled blog posts
    const { data: blogs, error: blogErr } = await supabase
      .from("blog_posts")
      .update({ published: true })
      .eq("published", false)
      .not("scheduled_at", "is", null)
      .lte("scheduled_at", now)
      .select("id");

    // Auto-publish scheduled echoes posts
    const { data: echoes, error: echoesErr } = await supabase
      .from("echoes_posts")
      .update({ published: true })
      .eq("published", false)
      .not("scheduled_at", "is", null)
      .lte("scheduled_at", now)
      .select("id");

    // Auto-publish scheduled notifications
    const { data: notifs, error: notifsErr } = await supabase
      .from("notifications")
      .update({ published: true })
      .eq("published", false)
      .not("scheduled_at", "is", null)
      .lte("scheduled_at", now)
      .select("id");

    return new Response(
      JSON.stringify({
        published: {
          blogs: blogs?.length || 0,
          echoes: echoes?.length || 0,
          notifications: notifs?.length || 0,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
