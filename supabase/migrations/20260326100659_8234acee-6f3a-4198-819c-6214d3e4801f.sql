-- Fix: Allow admin email to self-assign admin role
CREATE POLICY "Admin email can self-assign"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role = 'admin'
  AND (auth.jwt()->>'email') = 'yashrajverma916@gmail.com'
);

-- Reviews table for testimonials
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  name text NOT NULL,
  detail text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Admin can insert reviews" ON public.reviews FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can update reviews" ON public.reviews FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete reviews" ON public.reviews FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default reviews
INSERT INTO public.reviews (quote, name, detail) VALUES
  ('A collection that speaks directly to the soul. Every poem resonated with an emotion I didn''t know I had.', 'A Reader', 'Poetry Enthusiast'),
  ('V.Yash.Raj has a way with words that makes you pause, reflect, and feel deeply.', 'Book Lover', 'Goodreads Reviewer'),
  ('Indulgent Echoes is not just a book — it''s an experience. The story at the end ties everything beautifully.', 'Literature Fan', 'Early Reader');