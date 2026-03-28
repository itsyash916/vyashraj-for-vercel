import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, Menu, X, Home, LogIn, LogOut, User, Shield, Sun, Moon } from "lucide-react";
import { ThreadsIcon, GoodreadsIcon, XIcon } from "./SocialIcons";
import NotificationBell from "./NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const socialLinks = [
  { href: "https://www.instagram.com/v.yash.raj/", icon: Instagram, label: "Instagram" },
  { href: "https://x.com/vyash_raj", icon: XIcon, label: "X" },
  { href: "https://www.threads.net/@v.yash.raj", icon: ThreadsIcon, label: "Threads" },
  { href: "https://www.goodreads.com/user/show/199826799-v-yash-raj", icon: GoodreadsIcon, label: "Goodreads" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, isAdmin, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Home", to: "/", icon: Home },
    { label: "Book", to: isHome ? "#book" : "/#book" },
    { label: "Echoes", to: "/echoes" },
    { label: "Blog", to: "/blog" },
    { label: "About", to: isHome ? "#about" : "/#about" },
    { label: "Contact", to: "/contact" },
  ];

  const handleNavClick = (to: string) => {
    setMobileOpen(false);
    if (to.startsWith("#")) {
      const el = document.querySelector(to);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isRouteLink = (to: string) => to.startsWith("/") && !to.startsWith("/#");

  return (
    <>
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "py-3 bg-background/40 backdrop-blur-xl border-b border-primary/10 shadow-lg shadow-primary/5" : "py-5 bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-foreground hover:text-primary transition-colors">V.Yash.Raj</Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) =>
            isRouteLink(item.to) ? (
              <Link key={item.label} to={item.to}
                className="text-sm font-accent text-foreground/70 hover:text-primary transition-colors tracking-wider flex items-center gap-1.5">
                {item.icon && <item.icon className="w-3.5 h-3.5" />}{item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.to}
                onClick={(e) => { if (isHome && item.to.startsWith("#")) { e.preventDefault(); handleNavClick(item.to); } }}
                className="text-sm font-accent text-foreground/70 hover:text-primary transition-colors tracking-wider">{item.label}</a>
            )
          )}

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-all" title={s.label}>
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="h-4 w-px bg-border" />

          {/* Theme Toggle */}
          <button onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-all" title="Toggle theme">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              {isAdmin && (
                <Link to="/admin" className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-all" title="Admin">
                  <Shield className="w-4 h-4" />
                </Link>
              )}
              <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 hover:border-primary/40 transition-colors">
                <Avatar className="w-full h-full">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs"><User className="w-3.5 h-3.5" /></AvatarFallback>
                </Avatar>
              </Link>
              <button onClick={() => setShowSignOutConfirm(true)} className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-all" title="Sign Out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-accent tracking-wider hover:bg-primary/90 transition-all">
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggleTheme} className="text-foreground/70 hover:text-primary transition-colors">
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          {user && <NotificationBell />}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground/70 hover:text-primary transition-colors">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 p-6 rounded-2xl bg-background/60 backdrop-blur-xl border border-primary/10 shadow-xl animate-fade-in">
          <div className="flex flex-col gap-4">
            {navItems.map((item) =>
              isRouteLink(item.to) ? (
                <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)}
                  className="text-sm font-accent text-foreground/70 hover:text-primary transition-colors tracking-wider py-2 flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}{item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.to}
                  onClick={(e) => { if (isHome && item.to.startsWith("#")) { e.preventDefault(); handleNavClick(item.to); } else { setMobileOpen(false); } }}
                  className="text-sm font-accent text-foreground/70 hover:text-primary transition-colors tracking-wider py-2">{item.label}</a>
              )
            )}

            {user ? (
              <>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-accent text-foreground/70 hover:text-primary py-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Admin</Link>}
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-accent text-foreground/70 hover:text-primary py-2 flex items-center gap-2"><User className="w-4 h-4" /> Profile</Link>
                <button onClick={() => { setMobileOpen(false); setShowSignOutConfirm(true); }} className="text-sm font-accent text-foreground/70 hover:text-primary py-2 flex items-center gap-2 text-left"><LogOut className="w-4 h-4" /> Sign Out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-sm font-accent text-primary py-2 flex items-center gap-2"><LogIn className="w-4 h-4" /> Sign In</Link>
            )}
          </div>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-all" title={s.label}>
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>

    {/* Sign Out Confirmation */}
    {showSignOutConfirm && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-card border border-primary/15 rounded-2xl p-8 max-w-sm mx-4 shadow-2xl shadow-primary/10">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Sign Out?</h3>
          <p className="text-sm text-muted-foreground font-body mb-6">Are you sure you want to sign out of your account?</p>
          <div className="flex gap-3">
            <button onClick={() => setShowSignOutConfirm(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-accent hover:bg-primary/5 transition-all">Cancel</button>
            <button onClick={() => { signOut(); setShowSignOutConfirm(false); }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-accent hover:bg-destructive/90 transition-all">Sign Out</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;
