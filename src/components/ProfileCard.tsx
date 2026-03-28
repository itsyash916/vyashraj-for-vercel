import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ProfileCardProps {
  profile: {
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    email_visible: boolean;
  };
  email?: string;
}

const ProfileCard = ({ profile, email }: ProfileCardProps) => (
  <div className="p-4 rounded-xl bg-card/80 backdrop-blur-xl border border-primary/15 shadow-xl min-w-[240px]">
    <div className="flex items-center gap-3 mb-3">
      <Avatar className="w-12 h-12 border-2 border-primary/20">
        <AvatarImage src={profile.avatar_url || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary">
          <User className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-display font-semibold text-foreground">{profile.display_name || "Anonymous"}</p>
        {profile.email_visible && email && (
          <p className="text-xs text-muted-foreground font-accent">{email}</p>
        )}
      </div>
    </div>
    {profile.bio && (
      <p className="text-sm text-muted-foreground font-body leading-relaxed">{profile.bio}</p>
    )}
  </div>
);

export default ProfileCard;
