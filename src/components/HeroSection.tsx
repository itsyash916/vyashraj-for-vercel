import { useEffect, useRef } from "react";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-gold-light/10 blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-1/3 right-1/4 w-px h-24 bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
      
      {/* Floating gold dots */}
      <div className="absolute top-1/4 right-1/3 w-2 h-2 rounded-full bg-primary/30 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-primary/20 animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-2/3 right-1/5 w-1 h-1 rounded-full bg-primary/40 animate-float" style={{ animationDelay: "4s" }} />

      <div className="animate-on-scroll opacity-0 transition-all duration-1000 ease-out text-center max-w-3xl">
        <p className="text-sm tracking-[0.4em] uppercase text-muted-foreground mb-6 font-accent">
          Poet · Author · Dreamer
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-4">
          <span className="text-foreground">Yash Raj</span>{" "}
          <span className="text-gold-gradient">Verma</span>
        </h1>

        <div className="gold-divider w-40 mx-auto my-8" />

        <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed max-w-xl mx-auto mb-4">
          Where paper meets emotions
        </p>

        <p className="text-base text-muted-foreground/70 font-accent italic">
          V.Yash.Raj
        </p>
      </div>

      <div className="animate-on-scroll opacity-0 transition-all duration-1000 delay-500 ease-out mt-12 flex flex-col sm:flex-row items-center gap-4">
        <a
          href="#book"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-accent text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
        >
          Discover the Book
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-bounce">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a
          href="#about"
          className="inline-flex items-center gap-2 px-8 py-3 border border-primary/30 rounded-full text-foreground font-accent text-sm tracking-wider hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
        >
          About the Author
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-on-scroll opacity-0 transition-all duration-1000 delay-1000">
        <span className="text-xs text-muted-foreground/50 font-accent tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary/40 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
