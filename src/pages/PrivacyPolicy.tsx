import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="font-body text-foreground/80 leading-relaxed space-y-6 text-lg">
          <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

          <h2 className="text-2xl font-display font-semibold text-foreground mt-8">Information We Collect</h2>
          <p>When you use our contact form, we may collect your name, email address, and any message content you provide. This information is used solely to respond to your inquiry.</p>

          <h2 className="text-2xl font-display font-semibold text-foreground mt-8">How We Use Your Information</h2>
          <p>Your information is used only to communicate with you regarding your inquiry. We do not sell, trade, or share your personal information with third parties.</p>

          <h2 className="text-2xl font-display font-semibold text-foreground mt-8">Cookies</h2>
          <p>This website does not use cookies or tracking technologies.</p>

          <h2 className="text-2xl font-display font-semibold text-foreground mt-8">Third-Party Links</h2>
          <p>Our website may contain links to external sites (Instagram, X, Threads, Goodreads). We are not responsible for the privacy practices of these external sites.</p>

          <h2 className="text-2xl font-display font-semibold text-foreground mt-8">Contact</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at{" "}
            <a href="mailto:yashrajverma916@gmail.com" className="text-primary hover:underline">yashrajverma916@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
    <FooterSection />
  </div>
);

export default PrivacyPolicy;
