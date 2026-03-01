import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

/* ── Icon Components ── */
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

const FeatureCard = ({ icon, title, desc, delay = 0 }) => (
  <div
    className="glass rounded-3xl p-6 shadow-card hover:shadow-glass-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neo-blue/20 to-neo-teal/20 flex items-center justify-center mb-4 text-neo-blue">
      {icon}
    </div>
    <h3 className="font-display font-600 text-neo-dark mb-2">{title}</h3>
    <p className="text-sm text-neo-muted font-body leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc, icon }) => (
  <div className="flex gap-4 items-start">
    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-neo-blue to-neo-teal flex items-center justify-center text-white font-display font-700 shadow-md">
      {number}
    </div>
    <div>
      <h4 className="font-display font-600 text-neo-dark mb-1">{title}</h4>
      <p className="text-sm text-neo-muted font-body leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TestimonialCard = ({ quote, author, role, avatar }) => (
  <div className="glass rounded-3xl p-6 shadow-card flex flex-col gap-4">
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-neo-yellow fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
    <p className="text-sm text-neo-dark font-body leading-relaxed italic">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neo-blue to-neo-teal flex items-center justify-center text-white font-display font-700 text-sm">
        {avatar}
      </div>
      <div>
        <p className="text-sm font-display font-600 text-neo-dark">{author}</p>
        <p className="text-xs text-neo-muted font-body">{role}</p>
      </div>
    </div>
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl font-display font-800 gradient-text">{value}</div>
    <div className="text-sm text-neo-muted font-body mt-1">{label}</div>
  </div>
);

const LandingPage = () => {
  const { token } = useAuth();
  const heroRef = useRef(null);

  // Parallax subtle effect
  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.08}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-neo-blue/10 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-neo-teal/10 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neo-yellow/08 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left content */}
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 bg-neo-blue/10 text-neo-blue text-xs font-display font-600 px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-neo-teal animate-pulse-ring" />
              AI-Powered Neonatal Care
            </span>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-800 text-neo-dark leading-tight mb-6">
              Smart Non-Invasive
              <br />
              <span className="gradient-text">Jaundice Screening</span>
              <br />
              for Newborns
            </h1>

            <p className="text-neo-muted font-body text-lg leading-relaxed mb-8 max-w-lg">
              NeoScan uses AI image analysis to estimate neonatal bilirubin levels —
              no needles, no lab delays. Instant screening at your fingertips.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to={token ? "/calibrate" : "/register"}
                className="px-7 py-3.5 bg-gradient-to-r from-neo-blue to-neo-teal text-white font-display font-700 rounded-2xl shadow-glass hover:shadow-glass-lg hover:scale-[1.02] transition-all"
              >
                Start Screening
              </Link>
              <Link
                to="/login"
                className="px-7 py-3.5 glass text-neo-blue font-display font-600 rounded-2xl shadow-card hover:shadow-glass transition-all border border-neo-blue/20"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-7 py-3.5 border border-neo-mint text-neo-muted font-display font-600 rounded-2xl hover:bg-neo-mint/20 transition-all"
              >
                Sign Up
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-2">
                {["N", "S", "M"].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-neo-blue to-neo-teal border-2 border-white flex items-center justify-center text-white text-xs font-700"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-neo-muted font-body">
                Trusted by <strong className="text-neo-dark">medical researchers</strong> & students
              </p>
            </div>
          </div>

          {/* Right: Demo card */}
          <div
            ref={heroRef}
            className="relative flex justify-center animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative w-full max-w-sm">
              {/* Main card */}
              <div className="glass rounded-4xl p-6 shadow-glass-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-display font-600 text-neo-dark">NeoScan Analysis</span>
                  <span className="flex items-center gap-1 text-xs text-neo-safe font-600">
                    <span className="w-2 h-2 rounded-full bg-neo-safe animate-pulse" />
                    Live
                  </span>
                </div>

                {/* Gauge preview */}
                <div className="bg-gradient-to-b from-emerald-50 to-teal-50 rounded-3xl p-5 mb-4 text-center">
                  <div className="text-4xl font-display font-800 text-neo-safe">4.8</div>
                  <div className="text-xs text-neo-muted font-body mt-1">mg/dL Bilirubin</div>
                  <div className="mt-2 inline-block bg-emerald-100 text-emerald-700 text-xs font-600 px-3 py-1 rounded-full">
                    Safe Range
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { label: "Confidence", value: "94%", bar: 94, color: "from-neo-blue to-neo-teal" },
                    { label: "Risk Score", value: "Low", bar: 18, color: "from-neo-safe to-neo-teal" },
                  ].map(({ label, value, bar, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs font-body mb-1">
                        <span className="text-neo-muted">{label}</span>
                        <span className="font-600 text-neo-dark">{value}</span>
                      </div>
                      <div className="h-1.5 bg-neo-mint/30 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${bar}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating chips */}
              <div className="absolute -top-4 -right-4 glass rounded-2xl px-3 py-2 shadow-card text-xs font-display font-600 text-neo-blue">
                ✓ Calibrated
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-3 py-2 shadow-card text-xs font-display font-600 text-neo-teal">
                AI Powered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white/60 backdrop-blur-sm border-y border-white">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value="< 2min" label="Scan Duration" />
          <StatCard value="92%+" label="Accuracy Rate" />
          <StatCard value="0" label="Needles or Pain" />
          <StatCard value="AI" label="Risk Assessment" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-neo-blue font-display font-600 text-sm tracking-wide uppercase">Why NeoScan</span>
          <h2 className="font-display text-3xl md:text-4xl font-700 text-neo-dark mt-2">
            Designed for Care, Built for Speed
          </h2>
          <p className="text-neo-muted font-body mt-3 max-w-xl mx-auto">
            A complete non-invasive screening solution powered by machine learning and color analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard
            delay={0}
            title="Quick Screening"
            desc="Full bilirubin risk assessment in under 2 minutes — no waiting for lab results."
            icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.28L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95zM11 2.05C5.95 2.55 2 6.82 2 12c0 3.76 2.09 7.07 5.22 8.78L6 22h5v-5l-2.28 2.28C7.81 18 6 15.21 6 12c0-4.08 3.05-7.44 7-7.93V2.05z"/></svg>}
          />
          <FeatureCard
            delay={100}
            title="Completely Painless"
            desc="Camera-based analysis means zero needles, zero blood — safer and stress-free for newborns."
            icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>}
          />
          <FeatureCard
            delay={200}
            title="AI-Powered Accuracy"
            desc="Deep learning models trained on clinical bilirubin data for reliable risk classification."
            icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H5v-2h7v2zm7-4H5v-2h14v2zm0-4H5V7h14v2z"/></svg>}
          />
          <FeatureCard
            delay={300}
            title="Instant Reports"
            desc="Download a detailed screening report with bilirubin value, risk level, and trend graph."
            icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>}
          />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-neo-teal font-display font-600 text-sm tracking-wide uppercase">Process</span>
            <h2 className="font-display text-3xl md:text-4xl font-700 text-neo-dark mt-2">
              Three Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Calibrate Lighting",
                desc: "Capture a white surface image so NeoScan can normalize ambient lighting conditions for accurate color analysis.",
              },
              {
                number: "2",
                title: "Scan Baby's Skin",
                desc: "Point the camera at the baby's eye region or forehead. NeoScan extracts color data from the image in real time.",
              },
              {
                number: "3",
                title: "View Risk Report",
                desc: "AI analyzes the image and returns a bilirubin estimate, risk level, confidence score, and trend graph instantly.",
              },
            ].map((step) => (
              <div key={step.number} className="glass rounded-3xl p-6 shadow-card">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neo-blue to-neo-teal flex items-center justify-center text-white font-display font-700 text-lg shadow-md mb-4">
                  {step.number}
                </div>
                <h3 className="font-display font-700 text-neo-dark mb-2">{step.title}</h3>
                <p className="text-sm text-neo-muted font-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to={token ? "/calibrate" : "/register"}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-neo-blue to-neo-teal text-white font-display font-700 rounded-2xl shadow-glass hover:shadow-glass-lg hover:scale-[1.02] transition-all"
            >
              Try NeoScan Now
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Research Backed ── */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="glass rounded-4xl p-8 md:p-12 shadow-glass-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neo-teal/05 rounded-full blur-3xl" />
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-neo-teal font-display font-600 text-sm tracking-wide uppercase">Research Backed</span>
              <h2 className="font-display text-2xl md:text-3xl font-700 text-neo-dark mt-2 mb-4">
                Built on Clinical Evidence
              </h2>
              <p className="text-neo-muted font-body leading-relaxed mb-6">
                NeoScan's methodology is based on published research in transcutaneous
                bilirubinometry and smartphone-based jaundice detection. The model incorporates
                light calibration techniques validated in clinical settings.
              </p>
              <Link
                to="/research"
                className="inline-flex items-center gap-2 text-neo-blue font-display font-600 hover:gap-3 transition-all"
              >
                View Research Page
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "95%", label: "Sensitivity" },
                { value: "89%", label: "Specificity" },
                { value: "50+", label: "Test Subjects" },
                { value: "3", label: "Risk Categories" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white/60 rounded-3xl p-5 text-center shadow-card">
                  <div className="text-2xl font-display font-800 gradient-text">{value}</div>
                  <div className="text-xs text-neo-muted font-body mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-700 text-neo-dark">What People Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <TestimonialCard
              quote="Remarkable tool for a student project. The calibration step is a clever solution to the lighting variability problem."
              author="Dr. Sarah M."
              role="Pediatric Research Supervisor"
              avatar="S"
            />
            <TestimonialCard
              quote="The UI is clean and intuitive. The risk meter visualization makes it very easy to interpret results at a glance."
              author="James K."
              role="Medical Engineering Student"
              avatar="J"
            />
            <TestimonialCard
              quote="As a neonatology nurse, I appreciate how simple the workflow is. This could genuinely help in resource-limited settings."
              author="Amara O."
              role="NICU Nurse"
              avatar="A"
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-r from-neo-blue to-neo-teal rounded-4xl p-10 text-center shadow-glass-lg text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white"
                style={{
                  width: `${(i + 1) * 80}px`,
                  height: `${(i + 1) * 80}px`,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-800 mb-3 relative">
            Start Screening Today
          </h2>
          <p className="text-white/80 font-body mb-6 max-w-md mx-auto relative">
            Non-invasive, AI-driven, and available in your browser — no special hardware required.
          </p>
          <Link
            to={token ? "/calibrate" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-neo-blue font-display font-700 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all relative"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
