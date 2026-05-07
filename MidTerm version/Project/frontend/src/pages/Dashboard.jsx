import { useScanHistory } from "../hooks/use-scans";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Plus,
  Loader2,
  Baby,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { buildUrl } from "@shared/routes";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const user = JSON.parse(localStorage.getItem("neoscan_user") || "{}");

  const { data: baby, isLoading: babyLoading } = useQuery({
    queryKey: ["baby"],
    queryFn: async () => {
      const res = await fetch(buildUrl(`/baby?email=${user.email}`));
      // if (!res.ok) throw new Error("Failed to fetch baby profile");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: history, isLoading: historyLoading } = useScanHistory();
  const isLoading = babyLoading || historyLoading;

  const latestScan = history && history.length > 0 ? history[0] : null;

  const chartData = history
    ?.filter((h) => h.status === "complete" && h.bilirubinValue !== null)
    .map((h) => ({
      date: format(new Date(h.createdAt), "MMM dd"),
      value: h.bilirubinValue,
    }))
    .reverse() || [];

  useEffect(() => {
    if (!isLoading && (!baby || !baby.name)) {
      setLocation("/setup");
    }
  }, [isLoading, baby, setLocation]);

  if (!isLoading && (!baby || !baby.name)) {
    return null;
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">
            Welcome, {user.name}
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Health analytics for your baby
          </p>
        </div>

        <Link
          href="/scan"
          className="px-6 py-3 rounded-xl font-bold bg-[hsl(var(--primary))] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Scan
        </Link>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[hsl(var(--primary))] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Baby Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-3xl flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[hsl(var(--primary))/10] rounded-2xl flex items-center justify-center">
                <Baby className="w-8 h-8 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {baby?.name}
                </h3>
                <p className="text-muted-foreground capitalize">
                  {baby?.gender}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/5 rounded-2xl">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">
                  Age
                </p>
                <p className="text-xl font-bold">
                  {baby?.ageInDays} Days
                </p>
              </div>

              <div className="p-4 bg-black/5 rounded-2xl">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">
                  Born
                </p>
                <p className="text-xl font-bold">
                  {baby?.birthDate || "--"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Latest Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Latest Result
            </h2>

            {latestScan ? (
              <div className="flex flex-col items-center">
                {latestScan.status === "analyzing" ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="w-12 h-12 text-[hsl(var(--primary))] animate-spin" />
                    <p className="font-bold">Analyzing...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 w-full">
                    <div className="text-center w-full">
                      <p className="text-sm font-mono text-[hsl(var(--primary))] bg-black/5 p-4 rounded-2xl break-all leading-relaxed shadow-inner mb-6">
                        RGB Values: [{latestScan.featureVector && latestScan.featureVector.length >= 3
                          ? latestScan.featureVector.slice(0, 3).map((v) => Number(v).toFixed(2)).join(", ")
                          : "X, Y, Z"}]
                      </p>
                      <div className="p-6 bg-[hsl(var(--primary))/10] rounded-2xl flex flex-col items-center text-center">
                        <span className="text-lg font-bold text-[hsl(var(--primary))]">Bilirubin values will be available soon</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                XYZ
              </p>
            )}

            <div className="text-[10px] text-muted-foreground mt-4 text-center">
              {latestScan?.createdAt ? format(new Date(latestScan.createdAt), "PPP p") : ""}
            </div>
          </motion.div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 glass p-8 rounded-3xl flex flex-col"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              7-Day Trend
            </h2>

            <div className="flex-1 h-[150px]">
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={0.2}
                      fill="hsl(var(--primary))"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-black/5 rounded-2xl border border-dashed border-border text-xs text-muted-foreground">
                  Need more data for trend
                </div>
              )}
            </div>
          </motion.div>

          {/* Home Remedies / Action Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 glass p-8 rounded-3xl flex flex-col border-l-4 border-blue-400"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Baby className="w-6 h-6 text-blue-500" /> General Neonatal Care Guidelines
            </h2>

            {latestScan ? (
              <div className="space-y-4">
                <div className="bg-blue-50/50 text-slate-700 p-6 rounded-2xl flex gap-4">
                  <div>
                    <p className="text-sm leading-relaxed">
                      While NeoScan evaluates these visual metrics for our research models, here are standard, healthy ways to ensure your baby is thriving:
                    </p>
                    <ul className="list-disc ml-5 mt-4 space-y-2 text-sm font-medium">
                      <li>Ensure 8-12 feedings a day (breastmilk or formula) to help your baby flush out bilirubin naturally.</li>
                      <li>Expose your baby to indirect early morning sunlight (filtered through a window) for 10-15 minutes.</li>
                      <li>Keep track of wet and dirty diapers to verify they are properly hydrated.</li>
                      <li>Always consult your pediatrician for regular clinical check-ups or if you observe yellowing of the skin/eyes spreading to the chest or legs.</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Complete a scan to see general care guidelines.</p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}