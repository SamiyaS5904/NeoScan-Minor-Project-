import { CameraCapture } from "../components/CameraCapture";
import { useCalibrate } from "../hooks/use-scans";
import { useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";
import { motion } from "framer-motion";

export function Calibrate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const calibrateMutation = useCalibrate();

  const handleCapture = (base64Image) => {
    calibrateMutation.mutate(
      { image: base64Image },
      {
        onSuccess: () => {
          toast({
            title: "Calibration Successful",
            description: "Your camera is now ready for scanning.",
          });
          setLocation("/scan");
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Calibration Failed",
            description: err.message,
          });
        },
      }
    );
  };

  return (
    <div className="pt-28 pb-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <CameraCapture
          title="White Balance Calibration"
          description="Point your camera at a pure white surface (like printer paper) in the current lighting conditions and fill the target circle."
          onCapture={handleCapture}
          isPending={calibrateMutation.isPending}
        />
      </motion.div>
    </div>
  );
}