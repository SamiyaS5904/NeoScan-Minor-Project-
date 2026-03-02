import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useRegister } from "@/hooks/use-auth";
import { Activity, Loader2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerMutation = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password });
  };

  return (
    <div className="min-h-screen flex-center px-4 pt-20 pb-10">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-dark p-8 md:p-10 rounded-[2rem]"
      >
        <div className="flex-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex-center text-white shadow-lg">
            <Activity className="w-7 h-7" />
          </div>
        </div>

        <h2 className="text-3xl font-display font-bold text-center text-foreground mb-2">
          Create Account
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Start tracking with NeoScan today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-border focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary))/10] outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-border focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary))/10] outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-border focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary))/10] outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {registerMutation.error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 mt-2">
              {registerMutation.error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none transition-all flex-center gap-2 mt-6"
          >
            {registerMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-muted-foreground font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[hsl(var(--primary))] hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}