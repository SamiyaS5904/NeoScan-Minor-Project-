import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Info, AlertCircle, Clock, Globe } from "lucide-react";

export default function JaundiceInfo() {
  const newbornData = [
    { name: "Physiological Jaundice", value: 60, color: "hsl(var(--primary))" },
    { name: "Premature Babies", value: 80, color: "hsl(var(--accent))" },
  ];

  const riskData = [
    { name: "With Early Detection", risk: 5 },
    { name: "Delayed Detection", risk: 45 },
    { name: "No Screening", risk: 85 },
  ];

  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
          Neonatal Jaundice
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Understanding the importance of early detection and monitoring for newborn health.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Info className="text-[hsl(var(--primary))]" /> What is it?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Neonatal jaundice is a yellowing of a baby’s skin and eyes. It is
            extremely common and occurs when babies have a high level of
            bilirubin, a yellow pigment produced during normal breakdown of red
            blood cells.
          </p>

          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="text-[hsl(var(--risk-high))]" /> Why it
            occurs?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Newborns produce more bilirubin than adults do because of greater
            production and faster breakdown of red blood cells in the first few
            days of life. Normally, the liver filters bilirubin from the
            bloodstream, but a newborn's immature liver often can't remove
            bilirubin quickly enough.
          </p>
        </section>

        <section className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 text-center">
            Global Prevalence
          </h3>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newbornData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} unit="%" />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "12px" }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Approx. 60% of full-term and 80% of preterm infants develop
            jaundice.
          </p>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-8 bg-[hsl(var(--primary))/5] rounded-3xl border border-[hsl(var(--primary))/10]">
          <Globe className="w-10 h-10 text-[hsl(var(--primary))] mb-4" />
          <h4 className="text-xl font-bold mb-2">Early Detection</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Early screening reduces the risk of severe hyperbilirubinemia and
            associated complications.
          </p>
        </div>

        <div className="p-8 bg-[hsl(var(--accent))/5] rounded-3xl border border-[hsl(var(--accent))/10]">
          <Clock className="w-10 h-10 text-[hsl(var(--accent))] mb-4" />
          <h4 className="text-xl font-bold mb-2">Critical Window</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The first 48-72 hours of life are critical for monitoring bilirubin
            levels in newborns.
          </p>
        </div>

        <div className="p-8 bg-[hsl(var(--risk-high))/5] rounded-3xl border border-[hsl(var(--risk-high))/10]">
          <AlertCircle className="w-10 h-10 text-[hsl(var(--risk-high))] mb-4" />
          <h4 className="text-xl font-bold mb-2">Long-term Risks</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Untreated severe jaundice can lead to permanent brain damage
            (kernicterus).
          </p>
        </div>
      </div>

      <section className="glass p-12 rounded-3xl text-center">
        <h2 className="text-3xl font-bold mb-8">
          Mortality Risk vs Screening
        </h2>

        <div className="h-[300px] w-full max-w-2xl mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: "12px" }} />
              <Area
                type="monotone"
                dataKey="risk"
                stroke="hsl(var(--risk-high))"
                fill="hsl(var(--risk-high))"
                fillOpacity={0.1}
                strokeWidth={4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-12 bg-white/50 border border-border rounded-2xl p-6 text-left max-w-2xl mx-auto">
          <h3 className="font-bold text-xl mb-4">NeoScan AI Estimation Ranges</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[hsl(var(--risk-safe))]"></span>
              <strong>Safe:</strong> &lt; 7.0 mg/dL (Normal physiological levels)
            </li>
            <li className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[hsl(var(--risk-moderate))]"></span>
              <strong>Moderate:</strong> 7.0 - 12.0 mg/dL (Requires close monitoring)
            </li>
            <li className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[hsl(var(--risk-high))]"></span>
              <strong>High Risk:</strong> &gt; 12.0 mg/dL (A medically concerning threshold requiring immediate action)
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}