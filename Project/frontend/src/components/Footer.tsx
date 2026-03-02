import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="glass border-t border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-display font-bold text-lg text-foreground">NeoScan AI</span>
          </div>

          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <p className="text-muted-foreground text-sm">© 2025 NeoScan AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
