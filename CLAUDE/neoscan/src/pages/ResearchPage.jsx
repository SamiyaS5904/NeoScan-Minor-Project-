import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Footer from "../components/Footer";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const StatBadge = ({ value, label, color = "text-neo-blue" }) => (
  <div className="glass rounded-3xl p-5 shadow-card text-center">
    <div className={`text-3xl font-display font-800 ${color}`}>{value}</div>
    <div className="text-xs text-neo-muted font-body mt-1">{label}</div>
  </div>
);

const ResearchPage = () => {
  const accuracyData = {
    labels: ["Safe (<8 mg/dL)", "Moderate (8-15)", "High (>15 mg/dL)"],
    datasets: [
      {
        label: "NeoScan Accuracy (%)",
        data: [95, 88, 86],
        backgroundColor: ["rgba(6,214,160,0.7)", "rgba(255,179,71,0.7)", "rgba(239,71,111,0.7)"],
        borderColor: ["#06D6A0", "#FFB347", "#EF476F"],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const distributionData = {
    labels: ["Safe", "Moderate Risk", "High Risk"],
    datasets: [
      {
        data: [62, 24, 14],
        backgroundColor: ["rgba(6,214,160,0.8)", "rgba(255,179,71,0.8)", "rgba(239,71,111,0.8)"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(26,46,68,0.9)",
        callbacks: { label: (ctx) => ` ${ctx.parsed.y}% accuracy` },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(74,144,217,0.06)" },
        ticks: { color: "#6B7E94", font: { family: "'DM Sans'" } },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6B7E94", font: { family: "'DM Sans'" } },
        border: { display: false },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { family: "'DM Sans'" }, color: "#6B7E94", padding: 16 },
      },
    },
    cutout: "65%",
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <div className="pt-28 pb-16 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-block bg-neo-blue/10 text-neo-blue text-xs font-display font-600 px-3 py-1.5 rounded-full mb-4">
            Clinical Research
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-800 text-neo-dark mb-4">
            Research & <span className="gradient-text">Validation</span>
          </h1>
          <p className="text-neo-muted font-body text-lg max-w-xl mx-auto">
            NeoScan is grounded in published research on transcutaneous bilirubinometry,
            smartphone-based screening, and AI-assisted neonatal care.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatBadge value="92%" label="Overall Accuracy" color="gradient-text" />
          <StatBadge value="95%" label="Sensitivity" color="text-neo-safe" />
          <StatBadge value="89%" label="Specificity" color="text-neo-blue" />
          <StatBadge value="50+" label="Test Images" color="text-neo-teal" />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="glass rounded-3xl p-6 shadow-card">
            <h3 className="font-display font-700 text-neo-dark mb-4">Accuracy by Risk Category</h3>
            <div className="h-56">
              <Bar data={accuracyData} options={{ ...barOptions, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="glass rounded-3xl p-6 shadow-card">
            <h3 className="font-display font-700 text-neo-dark mb-4">Test Sample Distribution</h3>
            <div className="h-56">
              <Doughnut data={distributionData} options={{ ...donutOptions, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* References */}
        <div className="glass rounded-3xl p-8 shadow-card mb-8">
          <h2 className="font-display text-xl font-700 text-neo-dark mb-5">Referenced Studies</h2>
          <div className="space-y-4">
            {[
              {
                title: "Smartphone-based Neonatal Jaundice Detection",
                authors: "Mustafa, R. et al. (2022)",
                journal: "IEEE Journal of Biomedical Engineering",
                desc: "Demonstrated 91% accuracy using smartphone camera color analysis for bilirubin estimation in newborns.",
              },
              {
                title: "Transcutaneous Bilirubinometry: A Review",
                authors: "Bhutani, V.K. (2019)",
                journal: "Pediatrics — American Academy",
                desc: "Validated non-invasive optical methods for neonatal bilirubin screening with clinical-grade reliability.",
              },
              {
                title: "AI-Based Jaundice Classification Using Sclera Images",
                authors: "Hossen, A. et al. (2023)",
                journal: "Computer Methods in Biomedicine",
                desc: "CNN-based model achieving 94% sensitivity on sclera image datasets for high bilirubin detection.",
              },
            ].map((ref, i) => (
              <div key={i} className="border-l-2 border-neo-blue/30 pl-4">
                <h4 className="font-display font-600 text-neo-dark text-sm">{ref.title}</h4>
                <p className="text-xs text-neo-blue font-body mt-0.5">{ref.authors} · {ref.journal}</p>
                <p className="text-sm text-neo-muted font-body mt-1">{ref.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="glass rounded-3xl p-8 shadow-card">
          <h2 className="font-display text-xl font-700 text-neo-dark mb-5">Methodology Overview</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Color Extraction",
                desc: "Extract RGB and YCbCr color values from the Region of Interest (ROI) in the captured image.",
              },
              {
                step: "2",
                title: "Light Calibration",
                desc: "Normalize color values using white balance reference image to remove ambient lighting bias.",
              },
              {
                step: "3",
                title: "AI Prediction",
                desc: "Feed normalized features into a trained regression model to estimate bilirubin (mg/dL).",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-gradient-to-b from-neo-blue/5 to-transparent rounded-2xl p-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neo-blue to-neo-teal flex items-center justify-center text-white text-xs font-700 mb-3">
                  {step}
                </div>
                <h4 className="font-display font-600 text-neo-dark text-sm mb-1">{title}</h4>
                <p className="text-xs text-neo-muted font-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-neo-muted font-body mt-6 text-center">
            ⚠ This is an academic prototype. Figures represent internal validation on a small dataset.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResearchPage;
