import { BookOpen, Feather, Heart, MessageCircle, Smile, Star } from "lucide-react";

const reasons = [
  { title: "To express feelings honestly", text: "This book became the place where the emotions I could not say out loud finally found a voice.", icon: Heart },
  { title: "To show the life of a student", text: "It carries the pressure, wonder, confusion, ambition, and fragile beauty that live inside student life.", icon: BookOpen },
  { title: "To carve emotions into words", text: "I wanted passing moments, heartbreaks, and tiny joys to stay alive on paper instead of fading away.", icon: Feather },
  { title: "To let readers feel seen", text: "If someone opens these pages and feels understood for even one moment, the book has done its job.", icon: MessageCircle },
  { title: "To turn pain into something beautiful", text: "Writing helped transform heavy thoughts into rhythm, softness, and meaning that could be shared.", icon: Star },
  { title: "To hold on to fleeting memories", text: "These pages preserve the version of me that was learning, breaking, healing, and becoming.", icon: Smile },
];

const WhySection = () => (
  <section className="py-24 md:py-32 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="max-w-2xl mb-12">
        <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">Why I Wrote This Book</p>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Every page began with a feeling.</h2>
        <p className="text-lg text-muted-foreground font-body leading-relaxed">These are the quiet reasons behind <em>Indulgent Echoes</em> — personal, emotional, and deeply human.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reasons.map((reason) => (
          <article key={reason.title} className="group rounded-[1.75rem] border border-primary/10 bg-card/50 p-6 shadow-lg shadow-primary/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
              <reason.icon className="w-5 h-5" />
            </div>
            <h3 className="mb-3 text-xl font-display font-bold text-foreground">{reason.title}</h3>
            <p className="text-base font-body leading-relaxed text-muted-foreground">{reason.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default WhySection;