import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { useEffect, useRef } from "react";

const pages = [
  { label: "Home", to: "/", desc: "Landing page" },
  { label: "Echoes", to: "/echoes", desc: "Poems, Stories, Chillin & Chat" },
  { label: "Blog", to: "/blog", desc: "Blog posts & articles" },
  { label: "Contact", to: "/contact", desc: "Get in touch" },
  { label: "Sign In", to: "/auth", desc: "Sign in with Google" },
  { label: "Profile", to: "/profile", desc: "Your profile settings" },
  { label: "Privacy Policy", to: "/privacy-policy", desc: "Privacy information" },
  { label: "Copyright", to: "/copyright", desc: "Copyright details" },
];

const SiteMap = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("opacity-100", "translate-y-0"); e.target.classList.remove("opacity-0", "translate-y-8"); } }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div ref={ref} className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
            <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">Navigation</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Site Map</h1>
            <p className="text-muted-foreground font-body text-lg">All pages and links in one place</p>
          </div>

          <div className="space-y-3">
            {pages.map((page, i) => (
              <Link key={page.to} to={page.to}
                className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 block p-5 rounded-2xl bg-card/40 backdrop-blur border border-primary/10 hover:border-primary/30 hover:bg-primary/5 group`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{page.label}</h3>
                    <p className="text-sm text-muted-foreground font-body">{page.desc}</p>
                  </div>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors text-lg">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-card/30 border border-primary/10 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-700">
            <h3 className="font-display font-semibold text-foreground mb-3">Social Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Instagram", href: "https://www.instagram.com/v.yash.raj/" },
                { label: "X (Twitter)", href: "https://x.com/vyash_raj" },
                { label: "Threads", href: "https://www.threads.net/@v.yash.raj" },
                { label: "Goodreads", href: "https://www.goodreads.com/user/show/199826799-v-yash-raj" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-background/60 border border-border hover:border-primary/30 text-sm font-accent text-muted-foreground hover:text-primary transition-all text-center">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default SiteMap;
