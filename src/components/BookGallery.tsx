import { useEffect, useRef } from "react";
import bookCover1 from "@/assets/book-cover.png";
import bookCover2 from "@/assets/book-cover-2.png";
import bookCover3 from "@/assets/book-cover-3.png";

const images = [
  { src: bookCover1, alt: "Indulgent Echoes - Front Cover", caption: "Front Cover" },
  { src: bookCover3, alt: "Indulgent Echoes - Back Cover", caption: "Back Cover" },
  { src: bookCover2, alt: "Indulgent Echoes - Alternate View", caption: "Alternate View" },
];

const BookGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0", "scale-100");
            entry.target.classList.remove("opacity-0", "translate-y-8", "scale-95");
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
    <section id="gallery" ref={sectionRef} className="py-24 md:py-32 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">
            Book Catalogue
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            A Glimpse of the Book
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {images.map((img, i) => (
            <div
              key={i}
              className={`animate-on-scroll opacity-0 translate-y-8 scale-95 transition-all duration-700 ease-out`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-3 bg-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative overflow-hidden rounded-xl gold-border-glow">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p className="absolute bottom-4 left-0 right-0 text-center text-sm font-accent text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500 tracking-wider">
                    {img.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookGallery;
