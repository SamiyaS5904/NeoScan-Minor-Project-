import { motion } from "framer-motion";
import { FileText, Download, BookOpen, Layers, BarChart3 } from "lucide-react";

export default function Research() {
  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">Research & Methodology</h1>
        <p className="text-xl text-muted-foreground">Academic foundation and clinical validation overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { label: "Accuracy Rate", value: "94.2%", icon: <BarChart3 className="w-5 h-5" /> },
          { label: "Clinical Trials", value: "12+", icon: <Layers className="w-5 h-5" /> },
          { label: "Papers Reviewed", value: "85+", icon: <BookOpen className="w-5 h-5" /> },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-[hsl(var(--primary))/10] rounded-full flex items-center justify-center mb-3 text-[hsl(var(--primary))]">
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-[hsl(var(--primary))] pl-4">Methodology Overview</h2>
          <div className="glass p-8 rounded-3xl text-muted-foreground leading-relaxed">
            <p className="mb-4">
              NeoScan utilizes a lighting-normalized image processing pipeline combined with a deep convolutional neural network (CNN) to estimate serum bilirubin levels. The process involves:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Color calibration using a white reference surface to account for varying ambient lighting conditions.</li>
              <li>Region-of-interest (ROI) extraction focused on the sclera (eye white) and forehead areas.</li>
              <li>Feature extraction using chromaticity analysis in multiple color spaces (RGB, Lab, YCrCb).</li>
              <li>Risk classification based on age-adjusted bilirubin thresholds.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-[hsl(var(--primary))] pl-4">Literature Review & Papers</h2>
          <div className="grid gap-6">
            {[
              { title: "Deep Learning for Non-Invasive Bilirubin Estimation", journal: "Medical Image Analysis", year: "2024" },
              { title: "Chromaticity-based Neonatal Jaundice Screening: A Comparative Study", journal: "Journal of Clinical Pediatrics", year: "2023" },
              { title: "Smartphone Camera Sensor Calibration for Medical Diagnostics", journal: "IEEE Transactions on Biomedical Engineering", year: "2023" },
            ].map((paper, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-2xl flex items-center justify-between group hover:border-[hsl(var(--primary))/30] transition-colors"
              >
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-black/5 rounded-xl text-muted-foreground group-hover:text-[hsl(var(--primary))] transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-[hsl(var(--primary))] transition-colors">{paper.title}</h3>
                    <p className="text-xs text-muted-foreground">{paper.journal} • {paper.year}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-[hsl(var(--primary))/10] rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-muted-foreground" />
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
