import { useEffect, useRef } from "react";

const PoemPreview = () => {
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
    <section ref={sectionRef} className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">
            A Taste of the Pages
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-foreground">
            From the Book
          </h2>
        </div>

        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-200 ease-out">
          <div className="relative p-10 md:p-16 border border-border rounded-xl bg-card gold-border-glow">
            <div className="absolute top-6 left-8 text-6xl text-primary/20 font-display leading-none">"</div>

            <div className="font-body text-lg md:text-xl text-foreground/85 leading-loose space-y-4 italic">
              <p>Every feeling found you too,</p>
              <p>carried forward in all that you've been through.</p>
              <p>You were never just reading these pages —</p>
              <p>you lived within them, beyond all ages.</p>
              <p className="mt-6 text-primary font-accent not-italic font-semibold text-xl md:text-2xl">
                It's — "Not A Goodbye..."
              </p>
            </div>

            <div className="absolute bottom-6 right-8 text-6xl text-primary/20 font-display leading-none rotate-180">"</div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground font-accent">
            — From <em>Indulgent Echoes</em>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PoemPreview;
