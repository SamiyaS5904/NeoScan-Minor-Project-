import React, { useEffect, useRef } from "react";

/**
 * RiskMeter - Semicircular gauge showing bilirubin risk level
 * value: 0–100 (mapped from mg/dL range 0–25)
 * level: "safe" | "moderate" | "high"
 */
const RiskMeter = ({ bilirubinValue = 0, riskLevel = "safe", confidence = 0 }) => {
  const canvasRef = useRef(null);

  const levelConfig = {
    safe: {
      color: "#06D6A0",
      label: "Safe",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
    moderate: {
      color: "#FFB347",
      label: "Moderate Risk",
      bg: "bg-amber-50",
      text: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
    high: {
      color: "#EF476F",
      label: "High Risk",
      bg: "bg-rose-50",
      text: "text-rose-600",
      badge: "bg-rose-100 text-rose-700",
    },
  };

  const cfg = levelConfig[riskLevel] || levelConfig.safe;

  // Normalize bilirubin 0–25 mg/dL → 0–100%
  const percent = Math.min(Math.max((bilirubinValue / 25) * 100, 0), 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H * 0.85;
    const R = W * 0.38;

    ctx.clearRect(0, 0, W, H);

    // Draw background arc (full 180°)
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;

    // Gradient background arc
    const segments = [
      { from: 0, to: 0.45, color: "#06D6A0" },
      { from: 0.45, to: 0.7, color: "#FFD166" },
      { from: 0.7, to: 1, color: "#EF476F" },
    ];

    segments.forEach(({ from, to, color }) => {
      ctx.beginPath();
      ctx.arc(cx, cy, R, Math.PI + from * Math.PI, Math.PI + to * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 18;
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.25;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw filled arc up to current value
    const fillEnd = startAngle + (percent / 100) * Math.PI;
    const gradient = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
    gradient.addColorStop(0, "#06D6A0");
    gradient.addColorStop(0.5, "#FFD166");
    gradient.addColorStop(1, "#EF476F");

    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle, fillEnd);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.shadowBlur = 10;
    ctx.shadowColor = cfg.color;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw needle
    const needleAngle = Math.PI + (percent / 100) * Math.PI;
    const needleLen = R * 0.78;
    const nx = cx + needleLen * Math.cos(needleAngle);
    const ny = cy + needleLen * Math.sin(needleAngle);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.strokeStyle = cfg.color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
    ctx.fillStyle = cfg.color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Labels: Safe | Moderate | High
    ctx.font = "bold 9px 'Sora', sans-serif";
    ctx.fillStyle = "#6B7E94";
    ctx.textAlign = "left";
    ctx.fillText("SAFE", cx - R + 2, cy + 28);
    ctx.textAlign = "center";
    ctx.fillText("MOD", cx, cy - R - 10);
    ctx.textAlign = "right";
    ctx.fillText("HIGH", cx + R - 2, cy + 28);
  }, [percent, cfg.color]);

  return (
    <div className={`flex flex-col items-center rounded-3xl p-6 ${cfg.bg} border border-white shadow-card`}>
      {/* Canvas gauge */}
      <canvas ref={canvasRef} width={240} height={140} className="w-full max-w-[240px]" />

      {/* Value display */}
      <div className="text-center mt-2">
        <div className={`text-4xl font-display font-800 ${cfg.text}`}>
          {bilirubinValue.toFixed(1)}
        </div>
        <div className="text-sm text-neo-muted font-body mt-0.5">mg/dL</div>
      </div>

      {/* Risk badge */}
      <span className={`mt-3 px-4 py-1.5 rounded-full text-sm font-display font-600 ${cfg.badge}`}>
        {cfg.label}
      </span>

      {/* Confidence */}
      <div className="mt-4 w-full">
        <div className="flex justify-between text-xs text-neo-muted font-body mb-1.5">
          <span>AI Confidence</span>
          <span className="font-600 text-neo-dark">{confidence}%</span>
        </div>
        <div className="w-full h-2 bg-white rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${confidence}%`,
              background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RiskMeter;
