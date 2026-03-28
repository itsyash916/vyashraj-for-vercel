import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { ThreadsIcon, GoodreadsIcon, XIcon } from "./SocialIcons";

const FooterSection = () => {
  return (
    <footer className="py-16 px-6 bg-card border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="font-display text-2xl text-foreground mb-1">V.Yash.Raj</p>
            <p className="text-sm text-muted-foreground font-accent italic">Where paper meets emotions</p>
          </div>

          <div>
            <p className="font-accent text-sm font-semibold text-foreground mb-3">Quick Links</p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary font-accent transition-colors">Home</Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary font-accent transition-colors">Blog</Link>
              <Link to="/echoes" className="text-sm text-muted-foreground hover:text-primary font-accent transition-colors">Echoes</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary font-accent transition-colors">Contact</Link>
            </div>
          </div>

          <div className="flex md:justify-end items-start">
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/v.yash.raj/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-all" title="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="https://x.com/vyash_raj" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-all" title="X"><XIcon className="w-4 h-4" /></a>
              <a href="https://www.threads.net/@v.yash.raj" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-all" title="Threads"><ThreadsIcon className="w-4 h-4" /></a>
              <a href="https://www.goodreads.com/user/show/199826799-v-yash-raj" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-all" title="Goodreads"><GoodreadsIcon className="w-4 h-4" /></a>
            </div>
          </div>
        </div>

        <div className="gold-divider w-full mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-accent">
          <p>© {new Date().getFullYear()} Yash Raj Verma. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/copyright" className="hover:text-primary transition-colors">Copyright</Link>
            <Link to="/sitemap" className="hover:text-primary transition-colors">Site Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
