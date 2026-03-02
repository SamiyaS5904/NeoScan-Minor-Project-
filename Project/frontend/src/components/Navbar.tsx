import { Link, useLocation } from "wouter";
import { Activity, Menu, X, User } from "lucide-react";
import { useAuthStatus } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuthStatus();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = isAuthenticated
    ? [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Neonatal Jaundice", href: "/jaundice-info" },
      { name: "Research", href: "/research" },
    ]
    : [
      { name: "Home", href: "/" },
      { name: "Neonatal Jaundice", href: "/jaundice-info" },
      { name: "About Tech", href: "/about" },
      { name: "Research", href: "/research" },
    ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-blue-50/80 backdrop-blur-md py-5 shadow-sm" : "py-8"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">

          {/* LEFT - Logo */}
          <div className="flex flex-1 items-center">
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Activity strokeWidth={2.5} className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                Neo<span className="text-[hsl(var(--primary))]">Scan</span>
              </span>
            </Link>
          </div>

          {/* CENTER - Desktop Links */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors hover:text-[hsl(var(--primary))] ${location === link.href
                  ? "text-[hsl(var(--primary))]"
                  : "text-muted-foreground"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT - Auth */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  Sign Out
                </button>
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center border border-border">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium text-foreground hover:text-[hsl(var(--primary))] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-full font-semibold bg-[hsl(var(--primary))] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              className="text-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium p-2 rounded-lg hover:bg-black/5"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-border my-2" />
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-lg font-medium p-2 text-destructive"
                >
                  Sign Out
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center p-3 rounded-xl border border-border font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center p-3 rounded-xl bg-[hsl(var(--primary))] text-white font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}