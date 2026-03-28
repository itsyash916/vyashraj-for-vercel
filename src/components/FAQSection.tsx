import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Where can I buy 'Indulgent Echoes'?",
    a: "You can find Indulgent Echoes on Amazon, Flipkart, and other major online bookstores. Links are available in the Book section above.",
  },
  {
    q: "What genre is the book?",
    a: "Indulgent Echoes is a poetry and prose collection featuring 40 heartfelt poems and 1 captivating story that explores themes of love, loss, growth, and human emotions.",
  },
  {
    q: "Can I share poems from the book on social media?",
    a: "Yes! Feel free to share excerpts and tag @v.yash.raj on Instagram or @vyash_raj on X. Just please credit the book and author.",
  },
  {
    q: "Will there be a second book?",
    a: "Stay tuned! Follow me on social media or check the Echoes page for new poems, stories, and updates about upcoming works.",
  },
  {
    q: "How can I contact the author?",
    a: "You can reach out through the Contact page on this website, or email directly at yashrajverma916@gmail.com. I read every message!",
  },
  {
    q: "Can I collaborate or feature the book?",
    a: "Absolutely! Whether it's a review, feature, collaboration, or event — drop a message through the Contact page and let's create something beautiful together.",
  },
];

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("opacity-100", "translate-y-0"); e.target.classList.remove("opacity-0", "translate-y-8"); }
      }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
          <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">Questions & Answers</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Frequently Asked</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-5 rounded-xl bg-card/50 backdrop-blur border border-primary/10 hover:border-primary/25 transition-all text-left group"
              >
                <span className="font-accent text-sm text-foreground pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${openIdx === i ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIdx === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="px-5 py-4 text-sm text-muted-foreground font-body leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
