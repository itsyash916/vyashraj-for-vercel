import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, User, MessageSquare, FileText } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("opacity-100", "translate-y-0"); e.target.classList.remove("opacity-0", "translate-y-8"); } }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    } as any);

    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      // Also try to send email notification
      try {
        await supabase.functions.invoke("send-contact-email", {
          body: { name: form.name.trim(), email: form.email.trim(), subject: form.subject.trim(), message: form.message.trim() },
        });
      } catch {}
      toast.success("Message sent successfully! I'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div ref={sectionRef} className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">Get In Touch</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Contact Me</h1>
            <p className="text-muted-foreground font-body text-lg">Have a thought, a question, or just want to say hello? I'd love to hear from you.</p>
          </div>

          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-200 ease-out">
            <div className="relative p-8 md:p-10 rounded-2xl bg-card/40 backdrop-blur-xl border border-primary/15 shadow-xl shadow-primary/5">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
              <form onSubmit={handleSubmit} className="relative space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-accent text-foreground/70 mb-2"><User className="w-4 h-4 text-primary" /> Your Name</label>
                    <input type="text" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-accent text-foreground/70 mb-2"><Mail className="w-4 h-4 text-primary" /> Your Email</label>
                    <input type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-accent text-foreground/70 mb-2"><FileText className="w-4 h-4 text-primary" /> Subject</label>
                  <input type="text" required maxLength={200} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all" placeholder="What's this about?" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-accent text-foreground/70 mb-2"><MessageSquare className="w-4 h-4 text-primary" /> Your Message</label>
                  <textarea required maxLength={2000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all resize-none" placeholder="Write your message here..." />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-accent text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 disabled:opacity-60">
                  {sending ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground font-accent">
                Or reach out directly at <a href="mailto:thisisvyashraj@gmail.com" className="text-primary hover:underline">thisisvyashraj@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Contact;
