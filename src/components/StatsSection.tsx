import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 40, label: "Poems", suffix: "" },
  { value: 1, label: "Story", suffix: "" },
  { value: 100, label: "Pages of Emotion", suffix: "+" },
];

const AnimatedCounter = ({ target, suffix, active }: { target: number; suffix: string; active: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [active, target]);

  return <span>{count}{suffix}</span>;
};

const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 px-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-5xl font-display font-bold text-gold-gradient mb-2">
                <AnimatedCounter target={s.value} suffix={s.suffix} active={visible} />
              </p>
              <p className="text-sm text-muted-foreground font-accent tracking-wider uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
