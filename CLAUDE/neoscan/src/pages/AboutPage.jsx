import React from "react";
import Footer from "../components/Footer";

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-display text-xl font-700 text-neo-dark mb-3">{title}</h2>
    <div className="text-neo-muted font-body leading-relaxed space-y-3">{children}</div>
  </div>
);

const AboutPage = () => (
  <div className="min-h-screen bg-hero-gradient">
    {/* Hero */}
    <div className="pt-28 pb-16 max-w-4xl mx-auto px-6">
      <div className="text-center mb-12 animate-slide-up">
        <span className="inline-block bg-neo-teal/10 text-neo-teal text-xs font-display font-600 px-3 py-1.5 rounded-full mb-4">
          About the System
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-800 text-neo-dark mb-4">
          About <span className="gradient-text">NeoScan</span>
        </h1>
        <p className="text-neo-muted font-body text-lg max-w-xl mx-auto leading-relaxed">
          A smart, camera-based neonatal jaundice screening tool built as a final-year
          Computer Science capstone project.
        </p>
      </div>

      {/* Main content card */}
      <div className="glass rounded-4xl p-8 md:p-12 shadow-glass-lg mb-8 animate-fade-in">
        <Section title="What is Neonatal Jaundice?">
          <p>
            Neonatal jaundice (neonatal hyperbilirubinemia) affects up to 60% of full-term and 80%
            of preterm newborns in their first week of life. It is caused by an accumulation of
            bilirubin — a yellow pigment produced during the normal breakdown of red blood cells.
          </p>
          <p>
            While mild jaundice is usually harmless and self-resolving, elevated bilirubin levels
            can lead to serious neurological complications including hearing loss and brain damage.
            Early detection is critical.
          </p>
        </Section>

        <Section title="How NeoScan Works">
          <p>
            NeoScan uses the camera of a smartphone or laptop to capture images of the baby's
            skin — specifically the eye region or forehead. The sclera (white of the eye) and
            dermal tissue exhibit a yellow tinge when bilirubin levels are elevated.
          </p>
          <p>
            Before scanning, the user captures a white calibration image. This allows the system to
            normalize for ambient lighting conditions, ensuring color values extracted from the
            baby's image are accurate regardless of the environment.
          </p>
          <p>
            The calibration-adjusted RGB values are then passed through an AI model trained on
            clinical bilirubin measurements. The model outputs an estimated bilirubin value in
            mg/dL and assigns a risk category: Safe, Moderate, or High.
          </p>
        </Section>

        <Section title="Technology Stack">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              { label: "Frontend", value: "React 18 + Tailwind CSS + Chart.js" },
              { label: "Backend", value: "Python Flask + OpenCV + Scikit-Learn" },
              { label: "Camera", value: "Browser MediaDevices API" },
              { label: "Auth", value: "JWT (JSON Web Tokens)" },
              { label: "AI Model", value: "Regression + Color Feature Extraction" },
              { label: "Calibration", value: "White balance normalization" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/60 rounded-2xl p-4 border border-white">
                <div className="text-xs font-display font-600 text-neo-blue uppercase tracking-wide mb-1">{label}</div>
                <div className="text-sm text-neo-dark font-body">{value}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Limitations & Disclaimer">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-800 text-sm">
            <strong className="font-display font-700">⚠ Important Medical Disclaimer</strong>
            <p className="mt-2">
              NeoScan is an academic research prototype developed for educational purposes only.
              It is <strong>not a certified medical device</strong> and should not be used as a
              substitute for professional clinical diagnosis. Bilirubin estimates are approximations
              based on limited research data. Always consult a qualified healthcare professional for
              neonatal assessment.
            </p>
          </div>
        </Section>
      </div>

      {/* Team */}
      <div className="glass rounded-4xl p-8 shadow-glass-lg animate-fade-in">
        <h2 className="font-display text-xl font-700 text-neo-dark mb-6 text-center">Project Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Project Type", value: "Final Year CS Project" },
            { label: "Domain", value: "AI in Healthcare" },
            { label: "Technology", value: "Computer Vision + ML" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gradient-to-b from-neo-blue/5 to-neo-teal/5 rounded-2xl p-4">
              <div className="text-xs text-neo-muted font-body uppercase tracking-wide mb-1">{label}</div>
              <div className="font-display font-700 text-neo-dark">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Footer />
  </div>
);

export default AboutPage;
