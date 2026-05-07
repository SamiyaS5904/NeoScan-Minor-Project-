import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="glass border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-display font-bold text-xl text-foreground mb-2">NeoScan AI</span>
            <p className="text-muted-foreground text-sm max-w-xs">
              Built for Smart Non-Invasive Neonatal Screening using advanced AI analysis.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <p className="text-sm font-semibold text-foreground mb-1">Academic Project – CSE Final Year</p>
            <p className="text-muted-foreground text-xs">© 2025 NeoScan AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
