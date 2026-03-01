import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function getAuthHeaders() {
  const token = localStorage.getItem("neoscan_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export function useCalibrate() {
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.scans.calibrate.input>) => {
      const validated = api.scans.calibrate.input.parse(data);
      const res = await fetch(api.scans.calibrate.path, {
        method: api.scans.calibrate.method,
        headers: getAuthHeaders(),
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Calibration failed");
      return api.scans.calibrate.responses[200].parse(await res.json());
    },
  });
}

export function useAnalyze() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.scans.analyze.input>) => {
      const validated = api.scans.analyze.input.parse(data);
      const res = await fetch(api.scans.analyze.path, {
        method: api.scans.analyze.method,
        headers: getAuthHeaders(),
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Analysis failed to start");
      return api.scans.analyze.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scans.getHistory.path] });
    }
  });
}

export function useScanResult(scanId: number | null) {
  return useQuery({
    queryKey: [api.scans.getResult.path, scanId],
    queryFn: async () => {
      if (!scanId) return null;
      const url = buildUrl(api.scans.getResult.path, { scan_id: scanId });
      const res = await fetch(url, { headers: getAuthHeaders() });
      
      if (res.status === 404) throw new Error("Scan not found");
      if (!res.ok) throw new Error("Failed to fetch scan result");
      
      const data = await res.json();
      // Date coercion workaround for Zod parsing JSON responses
      return {
        ...data,
        createdAt: new Date(data.createdAt)
      };
    },
    enabled: !!scanId,
    // Poll every 2 seconds if status is analyzing
    refetchInterval: (query) => {
      return query.state.data?.status === 'analyzing' ? 2000 : false;
    },
  });
}

export function useScanHistory() {
  return useQuery({
    queryKey: [api.scans.getHistory.path],
    queryFn: async () => {
      const res = await fetch(api.scans.getHistory.path, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch history");
      
      const data = await res.json();
      // Coerce dates
      return data.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
    },
  });
}
