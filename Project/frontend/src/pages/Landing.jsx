import { motion } from "framer-motion";
import { Link } from "wouter";
import babyimage from "../assets/baby-image.jpg"
import {
  ShieldCheck,
  Smartphone,
  LineChart,
  ArrowRight,
  Zap,
  Eye,
  FileText,
  FlaskConical
} from "lucide-react";

export function Landing() {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="pt-24 pb-16">

      {/* ================= HERO ================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 overflow-hidden">

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[hsl(var(--primary))/10] rounded-full blur-[120px] -z-10" />

        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT SIDE */}
          <div>
            <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-[hsl(var(--primary))/20] text-[hsl(var(--primary))] font-medium mb-6">
              <Zap className="w-4 h-4 fill-current" />
              AI-Powered Neonatal Care
            </motion.div>

            <motion.h1
              {...fadeUp}
              className="text-5xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6"
            >
              Smart Non-Invasive{" "}
              <span className="text-gradient">
                Jaundice Screening
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl"
            >
              NeoScan estimates neonatal bilirubin levels using AI-based
              smartphone image analysis. No needles. No lab delays.
              Instant risk assessment in under 2 minutes.
            </motion.p>

            <motion.div {...fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-full font-bold bg-[hsl(var(--primary))] text-white shadow-xl shadow-[hsl(var(--primary))/25] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Start Screening <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/about"
                className="px-8 py-4 rounded-full glass font-semibold text-foreground hover:bg-black/5 transition"
              >
                Learn the Tech
              </Link>
            </motion.div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <motion.div {...fadeUp} className="relative flex justify-center">
            <div className="glass rounded-3xl p-4 shadow-2xl">
              <img
                src={babyimage}
                alt="NeoScan Baby Screening"
                className="rounded-2xl w-full max-w-sm object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-white/60 backdrop-blur border-y">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {[
            { value: "< 2 min", label: "Scan Duration" },
            { value: "0", label: "Needles Required" },
            { value: "AI", label: "Risk Classification" }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-display font-bold text-gradient">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Advanced AI Medical Screening
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            A complete non-invasive screening solution powered by
            machine learning and color calibration techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: <Smartphone className="w-8 h-8 text-[hsl(var(--primary))]" />,
              title: "Accessible",
              desc: "Works using standard smartphone camera."
            },
            {
              icon: <Eye className="w-8 h-8 text-[hsl(var(--accent))]" />,
              title: "Non-Invasive",
              desc: "Quick and painless screening via sclera (white of the eye) image analysis."
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-[hsl(var(--risk-safe))]" />,
              title: "AI-Powered",
              desc: "Neural networks trained on bilirubin datasets."
            },
            {
              icon: <LineChart className="w-8 h-8 text-[hsl(var(--primary))]" />,
              title: "Instant Results",
              desc: "Immediate risk report and confidence score."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary))/10] flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white/50 backdrop-blur py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Calibrate Lighting",
                desc: "Capture a reference surface image to normalize lighting."
              },
              {
                step: "2",
                title: "Scan Sclera",
                desc: "AI extracts RGB values from the sclera (white of the eye) region."
              },
              {
                step: "3",
                title: "View Risk Report",
                desc: "Instant bilirubin estimation with confidence score."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                className="glass p-8 rounded-3xl text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[hsl(var(--primary))] text-white flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Landing;


