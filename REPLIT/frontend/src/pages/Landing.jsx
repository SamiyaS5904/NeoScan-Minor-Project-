import { motion } from "framer-motion";
import { Link } from "wouter";
import { ShieldCheck, Smartphone, LineChart, ArrowRight, Zap, Eye } from "lucide-react";

export function Landing() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-32 pb-24 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--primary))/10] rounded-full blur-[100px] -z-10" />
        
        <motion.div {...fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-[hsl(var(--primary))/20] text-[hsl(var(--primary))] font-medium mb-8">
          <Zap className="w-4 h-4 fill-current" />
          No Special Hardware Required
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold text-foreground max-w-4xl mx-auto leading-tight mb-6"
        >
          Smart Non-Invasive <span className="text-gradient">Jaundice Screening</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Works Using Standard Smartphone Camera. Fast, accessible, and AI-powered bilirubin estimation for your newborn.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg bg-[hsl(var(--primary))] text-white shadow-xl shadow-[hsl(var(--primary))/25] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
            Start Screening <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/about" className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg glass text-foreground hover:bg-black/5 transition-all">
            Learn the Tech
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Advanced AI Medical Screening</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: <Smartphone className="w-8 h-8 text-[hsl(var(--primary))]" />,
              title: "Accessible",
              desc: "Works using standard smartphone camera. No hardware needed."
            },
            {
              icon: <Eye className="w-8 h-8 text-[hsl(var(--accent))]" />,
              title: "Non-Invasive",
              desc: "Quick and painless screening via image analysis of the eye region."
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-[hsl(var(--risk-safe))]" />,
              title: "AI-Powered",
              desc: "Advanced neural networks for high-confidence risk assessment."
            },
            {
              icon: <LineChart className="w-8 h-8 text-[hsl(var(--primary))]" />,
              title: "Fast Results",
              desc: "Instant insights and trend tracking for better monitoring."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary))/10] flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Landing;