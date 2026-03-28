import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  quote: string;
  name: string;
  detail: string;
}

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    supabase.from("reviews").select("*").order("created_at", { ascending: true })
      .then(({ data }) => setReviews((data as any) || []));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (reviews.length === 0) return;
    const el = scrollRef.current;
    if (!el) return;
    let animFrame: number;
    let speed = 0.5;

    const scroll = () => {
      el.scrollLeft += speed;
      // Reset when we've scrolled through the duplicated set
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
      animFrame = requestAnimationFrame(scroll);
    };

    animFrame = requestAnimationFrame(scroll);

    const pause = () => { speed = 0; };
    const resume = () => { speed = 0.5; };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animFrame);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [reviews]);

  // Duplicate reviews for infinite scroll effect
  const displayReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">
            Whispers of Readers
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            What They Say
          </h2>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out"
          style={{ scrollBehavior: "auto" }}
        >
          {displayReviews.map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="flex-shrink-0 w-[340px] md:w-[400px]"
            >
              <div className="relative p-8 rounded-2xl bg-card/60 backdrop-blur-sm border border-primary/10 gold-border-glow h-full flex flex-col">
                <div className="text-4xl text-primary/30 font-display leading-none mb-4">"</div>
                <p className="text-foreground/80 font-body text-lg leading-relaxed italic flex-1">
                  {t.quote}
                </p>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="font-accent text-sm text-foreground font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-accent">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
