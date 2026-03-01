import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TrendChart = ({ readings = [] }) => {
  // Default mock data if no readings provided
  const defaultReadings = [
    { date: "Day 1", value: 4.2 },
    { date: "Day 2", value: 7.8 },
    { date: "Day 3", value: 12.1 },
    { date: "Day 4", value: 10.5 },
    { date: "Day 5", value: 8.3 },
    { date: "Day 6", value: 6.1 },
    { date: "Day 7", value: 4.9 },
  ];

  const data_points = readings.length > 0 ? readings : defaultReadings;

  const data = {
    labels: data_points.map((r) => r.date),
    datasets: [
      {
        label: "Bilirubin (mg/dL)",
        data: data_points.map((r) => r.value),
        borderColor: "#4A90D9",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "transparent";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(74, 144, 217, 0.25)");
          gradient.addColorStop(1, "rgba(74, 144, 217, 0.01)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#4A90D9",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      // Safe threshold line
      {
        label: "Safe Threshold (11.5 mg/dL)",
        data: data_points.map(() => 11.5),
        borderColor: "#EF476F",
        borderDash: [6, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { family: "'DM Sans', sans-serif", size: 12 },
          color: "#6B7E94",
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: "rgba(26, 46, 68, 0.9)",
        titleFont: { family: "'Sora', sans-serif", size: 12 },
        bodyFont: { family: "'DM Sans', sans-serif", size: 12 },
        cornerRadius: 10,
        padding: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y.toFixed(1)} mg/dL`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(74, 144, 217, 0.06)" },
        ticks: {
          font: { family: "'DM Sans', sans-serif", size: 11 },
          color: "#6B7E94",
        },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(74, 144, 217, 0.06)" },
        ticks: {
          font: { family: "'DM Sans', sans-serif", size: 11 },
          color: "#6B7E94",
          callback: (v) => `${v} mg/dL`,
        },
        border: { display: false },
        min: 0,
        max: 25,
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Line data={data} options={options} />
    </div>
  );
};

export default TrendChart;
