import { CameraCapture } from "@/components/CameraCapture";
import { useAnalyze } from "@/hooks/use-scans";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Scan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const analyzeMutation = useAnalyze();

  const user = JSON.parse(
    localStorage.getItem("neoscan_user") || "{}"
  );

  useEffect(() => {
    if (user.isCalibrated === 0) {
      toast({
        title: "Calibration Required",
        description:
          "Please complete color calibration before your first scan.",
        variant: "destructive",
      });
      setLocation("/calibrate");
    }
  }, [user.isCalibrated, setLocation]);

  const handleCapture = (base64Image) => {
    analyzeMutation.mutate(
      { image: base64Image },
      {
        onSuccess: (data) => {
          toast({
            title: "Image Captured",
            description: "Analyzing sclera data...",
          });
          setLocation("/dashboard");
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Scan Failed",
            description: err.message,
          });
        },
      }
    );
  };

  return (
    <div className="pt-28 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CameraCapture
          title="Sclera Scan"
          description="Position the baby's eye region (sclera) within the target. Ensure even, natural lighting."
          onCapture={handleCapture}
          isPending={analyzeMutation.isPending}
        />
      </motion.div>
    </div>
  );
}