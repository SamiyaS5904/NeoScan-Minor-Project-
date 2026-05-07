import { useScanHistory } from "@/hooks/use-scans";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus, AlertCircle, CheckCircle2, AlertTriangle, Loader2, Baby, Calendar, User } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

const getRiskColor = (level: string | null | undefined) => {
  switch (level?.toLowerCase()) {
    case 'safe': return 'text-[hsl(var(--risk-safe))]';
    case 'moderate': return 'text-[hsl(var(--risk-moderate))]';
    case 'high': return 'text-[hsl(var(--risk-high))]';
    default: return 'text-muted-foreground';
  }
};

const getRiskBg = (level: string | null | undefined) => {
  switch (level?.toLowerCase()) {
    case 'safe': return 'bg-[hsl(var(--risk-safe))/10]';
    case 'moderate': return 'bg-[hsl(var(--risk-moderate))/10]';
    case 'high': return 'bg-[hsl(var(--risk-high))/10]';
    default: return 'bg-black/5';
  }
};

const getRiskIcon = (level: string | null | undefined) => {
  switch (level?.toLowerCase()) {
    case 'safe': return <CheckCircle2 className={`w-8 h-8 ${getRiskColor(level)}`} />;
    case 'moderate': return <AlertTriangle className={`w-8 h-8 ${getRiskColor(level)}`} />;
    case 'high': return <AlertCircle className={`w-8 h-8 ${getRiskColor(level)}`} />;
    default: return null;
  }
};

export function Dashboard() {
  const [, setLocation] = useLocation();
  const user = JSON.parse(localStorage.getItem("neoscan_user") || "{}");
  
  const { data: baby, isLoading: babyLoading } = useQuery({
    queryKey: [api.baby.get.path],
    queryFn: async () => {
      const res = await fetch(api.baby.get.path);
      if (!res.ok) throw new Error("Failed to fetch baby profile");
      return res.json();
    }
  });

  const { data: history, isLoading: historyLoading } = useScanHistory();
  const isLoading = babyLoading || historyLoading;

  const latestScan = history && history.length > 0 ? history[0] : null;

  const chartData = history?.filter(h => h.status === 'complete' && h.bilirubinValue !== null)
    .map(h => ({
      date: format(new Date(h.createdAt), 'MMM dd'),
      value: h.bilirubinValue,
    })).reverse() || [];

  if (!isLoading && !baby) {
    setLocation("/baby-setup");
    return null;
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Welcome, {user.motherName || user.name}</h1>
          <p className="text-muted-foreground mt-1 text-lg">Health analytics for {baby?.name}</p>
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
          
          {/* Baby Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-3xl flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[hsl(var(--primary))/10] rounded-2xl flex items-center justify-center">
                <Baby className="w-8 h-8 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{baby?.name}</h3>
                <p className="text-muted-foreground capitalize">{baby?.gender}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/5 rounded-2xl">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Age</p>
                <p className="text-xl font-bold">{baby?.ageInDays} Days</p>
              </div>
              <div className="p-4 bg-black/5 rounded-2xl">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Born</p>
                <p className="text-xl font-bold">{baby?.birthDate || '--'}</p>
              </div>
            </div>
          </motion.div>

          {/* Last Scan Result Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Latest Result</h2>
            
            {latestScan ? (
              <div className="flex flex-col items-center">
                {latestScan.status === 'analyzing' ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="w-12 h-12 text-[hsl(var(--primary))] animate-spin" />
                    <p className="font-bold">Analyzing...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-center">
                        <p className="text-4xl font-display font-bold text-foreground">{latestScan.bilirubinValue}</p>
                        <p className="text-xs text-muted-foreground uppercase font-bold">mg/dL</p>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{latestScan.confidence}%</p>
                        <p className="text-xs text-muted-foreground uppercase font-bold">Confidence</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${getRiskBg(latestScan.riskLevel)}`}>
                      {getRiskIcon(latestScan.riskLevel)}
                      <span className={`font-bold ${getRiskColor(latestScan.riskLevel)}`}>{latestScan.riskLevel} Risk</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No scans recorded yet.</p>
            )}
            
            <div className="text-[10px] text-muted-foreground mt-4 text-center">
              {latestScan?.createdAt ? format(new Date(latestScan.createdAt), 'PPP p') : ''}
            </div>
          </motion.div>

          {/* Trend Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1 glass p-8 rounded-3xl flex flex-col"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">7-Day Trend</h2>
            <div className="flex-1 h-[150px]">
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-black/5 rounded-2xl border border-dashed border-border text-xs text-muted-foreground">
                  Need more data for trend
                </div>
              )}
            </div>
          </motion.div>

          {/* History List */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-foreground mb-6">Scan History</h2>
            <div className="glass rounded-3xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-black/5 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Timestamp</th>
                    <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Bilirubin (mg/dL)</th>
                    <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Risk Level</th>
                    <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history?.map((scan) => (
                    <tr key={scan.id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{format(new Date(scan.createdAt!), 'MMM dd, HH:mm')}</td>
                      <td className="px-6 py-4 font-bold">{scan.bilirubinValue || '--'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getRiskBg(scan.riskLevel)} ${getRiskColor(scan.riskLevel)}`}>
                          {scan.riskLevel || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{scan.status}</td>
                    </tr>
                  ))}
                  {history?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">No scans recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
