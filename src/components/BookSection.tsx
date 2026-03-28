import { useEffect, useRef } from "react";
import bookCover from "@/assets/book-cover.png";

const BookSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
      { threshold: 0.15 }
    );

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="book" ref={sectionRef} className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Book Cover */}
          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl group-hover:bg-primary/15 transition-all duration-500" />
              <img
                src={bookCover}
                alt="Indulgent Echoes - Book Cover"
                className="relative w-72 md:w-80 rounded-lg shadow-2xl gold-border-glow transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-200 ease-out">
            <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">
              The Debut Collection
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-2 text-foreground">
              Indulgent Echoes
            </h2>
            <p className="text-lg text-muted-foreground font-accent italic mb-6">
              The Voice of My Heart
            </p>

            <div className="gold-divider w-24 mb-8" />

            <p className="text-lg font-body text-foreground/80 leading-relaxed mb-6">
              A poetic journey through 40 verses and a closing story that explore the depths of human emotion — 
              love, longing, hope, and everything whispered between heartbeats. 
              Each poem is a window into the soul, and the story at the end ties every emotion 
              together, where paper truly meets emotions.
            </p>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground font-accent">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                40 Poems
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                1 Story
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Poetry & Prose
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                By V.Yash.Raj
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookSection;
