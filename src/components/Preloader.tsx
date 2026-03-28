import { useState, useEffect } from "react";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"drawing" | "fading">("drawing");

  useEffect(() => {
    const drawTimer = setTimeout(() => setPhase("fading"), 2800);
    const completeTimer = setTimeout(() => onComplete(), 3600);
    return () => {
      clearTimeout(drawTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-700 ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Decorative gold particles */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-primary/5 blur-2xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="flex flex-col items-center">
        <svg
          viewBox="0 0 600 120"
          className="w-[80vw] max-w-[500px] h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* V */}
          <path
            d="M30 20 L60 95 L90 20"
            stroke="hsl(38, 65%, 50%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="signature-path"
            style={{ animationDelay: "0s" }}
          />
          {/* . */}
          <circle cx="105" cy="90" r="3" fill="hsl(38, 65%, 50%)" className="signature-dot" style={{ animationDelay: "0.4s" }} />
          {/* Y */}
          <path
            d="M120 20 L140 55 L160 20 M140 55 L140 95"
            stroke="hsl(38, 65%, 50%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="signature-path"
            style={{ animationDelay: "0.5s" }}
          />
          {/* a */}
          <path
            d="M175 55 Q175 40 190 40 Q205 40 205 55 L205 95 M205 70 Q205 55 190 60 Q175 65 175 80 Q175 95 190 95 Q205 95 205 85"
            stroke="hsl(38, 65%, 50%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="signature-path"
            style={{ animationDelay: "0.8s" }}
          />
          {/* s */}
          <path
            d="M230 50 Q230 40 240 40 Q255 40 255 50 Q255 60 240 65 Q225 70 225 82 Q225 95 240 95 Q255 95 255 85"
            stroke="hsl(38, 65%, 50%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="signature-path"
            style={{ animationDelay: "1.0s" }}
          />
          {/* h */}
          <path
            d="M270 20 L270 95 M270 60 Q270 40 285 40 Q300 40 300 60 L300 95"
            stroke="hsl(38, 65%, 50%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="signature-path"
            style={{ animationDelay: "1.2s" }}
          />
          {/* . */}
          <circle cx="320" cy="90" r="3" fill="hsl(38, 65%, 50%)" className="signature-dot" style={{ animationDelay: "1.5s" }} />
          {/* R */}
          <path
            d="M340 95 L340 20 L365 20 Q385 20 385 40 Q385 58 365 58 L340 58 M365 58 L390 95"
            stroke="hsl(38, 65%, 50%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="signature-path"
            style={{ animationDelay: "1.6s" }}
          />
          {/* a */}
          <path
            d="M405 55 Q405 40 420 40 Q435 40 435 55 L435 95 M435 70 Q435 55 420 60 Q405 65 405 80 Q405 95 420 95 Q435 95 435 85"
            stroke="hsl(38, 65%, 50%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="signature-path"
            style={{ animationDelay: "1.9s" }}
          />
          {/* j */}
          <path
            d="M460 40 L460 90 Q460 105 445 108"
            stroke="hsl(38, 65%, 50%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="signature-path"
            style={{ animationDelay: "2.1s" }}
          />
          <circle cx="460" cy="28" r="3" fill="hsl(38, 65%, 50%)" className="signature-dot" style={{ animationDelay: "2.1s" }} />

          {/* Decorative underline swoosh */}
          <path
            d="M25 105 Q150 115 300 100 Q450 85 480 100"
            stroke="hsl(38, 65%, 50%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
            className="signature-path"
            style={{ animationDelay: "2.3s" }}
          />
        </svg>

        <p className="mt-6 text-sm tracking-[0.3em] uppercase text-muted-foreground font-accent signature-tagline">
          Where paper meets emotions
        </p>
      </div>
    </div>
  );
};

export default Preloader;
