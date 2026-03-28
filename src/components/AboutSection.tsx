import { useEffect, useRef } from "react";
import authorPhoto from "@/assets/author-photo.png";

const AboutSection = () => {
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
    <section id="about" ref={sectionRef} className="py-24 md:py-32 px-6 bg-card">
      <div className="max-w-5xl mx-auto text-center">
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">
            About the Author
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-foreground">
            The Voice Behind the Verses
          </h2>
        </div>

        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-200 ease-out flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-primary/20 gold-border-glow">
              <img
                src={authorPhoto}
                alt="Yash Raj Verma"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <p className="text-lg md:text-xl font-body text-foreground/80 leading-relaxed max-w-2xl mb-6">
            Yash Raj Verma, known in the literary world as V.Yash.Raj, is a young poet 
            who believes that words have the power to heal, connect, and transform. 
            His debut collection <em className="text-primary font-accent">Indulgent Echoes</em> is 
            a testament to the beauty found in vulnerability and the courage it takes 
            to pour one's heart onto paper.
          </p>

          <div className="gold-divider w-24 my-6" />

          <blockquote className="text-xl md:text-2xl font-display italic text-muted-foreground max-w-lg">
            "Every poem is a piece of my soul, offered to the world with open hands."
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
