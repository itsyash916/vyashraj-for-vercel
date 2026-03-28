-- Add threaded comments and comment likes
ALTER TABLE public.blog_comments
ADD COLUMN IF NOT EXISTS parent_comment_id uuid REFERENCES public.blog_comments(id) ON DELETE CASCADE;

ALTER TABLE public.echoes_comments
ADD COLUMN IF NOT EXISTS parent_comment_id uuid REFERENCES public.echoes_comments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_comment_id ON public.blog_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_echoes_comments_parent_comment_id ON public.echoes_comments(parent_comment_id);

CREATE TABLE IF NOT EXISTS public.blog_comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blog_comment_likes_unique UNIQUE (comment_id, user_id)
);

ALTER TABLE public.blog_comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog comment likes viewable by all"
ON public.blog_comment_likes
FOR SELECT
USING (true);

CREATE POLICY "Users can like blog comments"
ON public.blog_comment_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike own blog comment likes"
ON public.blog_comment_likes
FOR DELETE
USING ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.echoes_comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.echoes_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT echoes_comment_likes_unique UNIQUE (comment_id, user_id)
);

ALTER TABLE public.echoes_comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Echoes comment likes viewable by all"
ON public.echoes_comment_likes
FOR SELECT
USING (true);

CREATE POLICY "Users can like echoes comments"
ON public.echoes_comment_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike own echoes comment likes"
ON public.echoes_comment_likes
FOR DELETE
USING ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own blog comments"
ON public.blog_comments
FOR UPDATE
USING ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own echoes comments"
ON public.echoes_comments
FOR UPDATE
USING ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'));

-- Strengthen chat message validation for pinning and polls
CREATE OR REPLACE FUNCTION public.validate_chat_message_write()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.kind IS NULL OR NEW.kind NOT IN ('message', 'poll') THEN
    RAISE EXCEPTION 'Invalid chat message kind';
  END IF;

  IF NEW.kind = 'poll' AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can create polls';
  END IF;

  IF NEW.kind = 'poll' THEN
    IF COALESCE(length(trim(NEW.poll_question)), 0) = 0 THEN
      RAISE EXCEPTION 'Poll question is required';
    END IF;

    IF jsonb_typeof(NEW.poll_options) IS DISTINCT FROM 'array'
      OR jsonb_array_length(NEW.poll_options) < 2
      OR jsonb_array_length(NEW.poll_options) > 6 THEN
      RAISE EXCEPTION 'Polls must include between 2 and 6 options';
    END IF;
  ELSE
    NEW.poll_question := NULL;
    NEW.poll_options := '[]'::jsonb;
  END IF;

  IF (COALESCE(NEW.is_pinned, false) = true OR NEW.pinned_at IS NOT NULL)
    AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can pin or unpin chat messages';
  END IF;

  IF NEW.kind = 'message' AND COALESCE(length(trim(COALESCE(NEW.content, ''))), 0) = 0 AND NEW.media_url IS NULL THEN
    RAISE EXCEPTION 'A message needs text or media';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_chat_message_write ON public.chat_messages;
CREATE TRIGGER validate_chat_message_write
BEFORE INSERT OR UPDATE ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.validate_chat_message_write();

CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_poll_votes_unique_user_vote
ON public.chat_poll_votes(message_id, user_id);

-- Countdown settings
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS countdown_title text NOT NULL DEFAULT 'Launch';