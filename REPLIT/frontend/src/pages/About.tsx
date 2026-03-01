import { motion } from "framer-motion";
import { Cpu, ScanEye, Beaker } from "lucide-react";

export function About() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">The Technology Behind <span className="text-gradient">NeoScan</span></h1>
        <p className="text-xl text-muted-foreground">Understanding how smartphone cameras can estimate bilirubin levels.</p>
      </motion.div>

      <div className="space-y-12">
        {[
          {
            icon: <ScanEye className="w-8 h-8" />,
            title: "1. Colorimetric Analysis",
            content: "Neonatal jaundice presents as a yellowing of the skin caused by elevated bilirubin. Our technology analyzes the specific color spectra of the skin, extracting precise RGB and LAB values that correlate with transcutaneous bilirubin levels."
          },
          {
            icon: <Cpu className="w-8 h-8" />,
            title: "2. Machine Learning Models",
            content: "The raw color data is processed through our proprietary machine learning model. Trained on thousands of diverse clinical samples, the AI compensates for varying skin tones, lighting conditions, and camera sensor differences."
          },
          {
            icon: <Beaker className="w-8 h-8" />,
            title: "3. White Balance Calibration",
            content: "To ensure accuracy across different devices, NeoScan requires a brief calibration step using a pure white surface. This normalizes the ambient light color temperature, drastically reducing false readings."
          }
        ].map((section, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-dark p-8 md:p-10 rounded-3xl flex flex-col md:flex-row gap-6 items-start"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex-center text-white shrink-0 shadow-lg">
              {section.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-display">{section.title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
