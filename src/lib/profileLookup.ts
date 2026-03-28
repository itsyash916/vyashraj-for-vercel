import { supabase } from "@/integrations/supabase/client";

export type ProfileSummary = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio?: string | null;
  email_visible?: boolean;
};

export const fetchProfilesMap = async (userIds: string[]) => {
  const uniqueUserIds = Array.from(new Set(userIds.filter(Boolean)));

  if (uniqueUserIds.length === 0) {
    return {} as Record<string, ProfileSummary>;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, display_name, avatar_url, bio, email_visible")
    .in("user_id", uniqueUserIds);

  if (error) {
    console.error("Failed to fetch profiles:", error.message);
    return {} as Record<string, ProfileSummary>;
  }

  return Object.fromEntries((data ?? []).map((profile) => [profile.user_id, profile])) as Record<string, ProfileSummary>;
};