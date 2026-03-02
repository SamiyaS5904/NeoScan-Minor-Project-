import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "../shared/routes";
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
    mutationFn: async (data: any) => {
      const user = JSON.parse(localStorage.getItem("neoscan_user") || "{}");
      const res = await fetch(buildUrl(`/calibrate?email=${user.email}`), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Calibration failed");
      return await res.json();
    },
  });
}

export function useAnalyze() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const user = JSON.parse(localStorage.getItem("neoscan_user") || "{}");
      const res = await fetch(buildUrl(`/analyze?email=${user.email}`), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Analysis failed to start");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/history"] });
    }
  });
}

export function useScanResult(scanId: number | null) {
  return useQuery({
    queryKey: ["/scan", scanId],
    queryFn: async () => {
      if (!scanId) return null;
      const url = buildUrl(`/scan/${scanId}`);
      const res = await fetch(url, { headers: getAuthHeaders() });

      if (res.status === 404) throw new Error("Scan not found");
      if (!res.ok) throw new Error("Failed to fetch scan result");

      const data = await res.json();
      // Date coercion workaround for Zod parsing JSON responses
      return {
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
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
    queryKey: ["/history"],
    queryFn: async () => {
      const user = JSON.parse(localStorage.getItem("neoscan_user") || "{}");
      const res = await fetch(buildUrl(`/history?email=${user.email}`), { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch history");

      const data = await res.json();
      // Coerce dates
      return data.map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
      }));
    },
  });
}
