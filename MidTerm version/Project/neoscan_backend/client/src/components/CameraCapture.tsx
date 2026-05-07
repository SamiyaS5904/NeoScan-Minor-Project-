import { useEffect } from "react";
import { Camera, RefreshCw, AlertCircle } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { motion, AnimatePresence } from "framer-motion";

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  title: string;
  description: string;
  isPending?: boolean;
}

export function CameraCapture({ onCapture, title, description, isPending }: CameraCaptureProps) {
  const { videoRef, canvasRef, error, isReady, startCamera, captureImage } = useCamera();

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const handleCapture = () => {
    const image = captureImage();
    if (image) {
      onCapture(image);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="relative w-full aspect-[4/3] bg-black/5 rounded-3xl overflow-hidden shadow-2xl shadow-[hsl(var(--primary))/10] border border-border">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-destructive p-6 text-center">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Guide overlay */}
            <div className="absolute inset-0 pointer-events-none border-4 border-white/20 m-6 rounded-2xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-white/50 rounded-full flex-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />

        <AnimatePresence>
          {!isReady && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex-center bg-background/80 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center text-primary">
                <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                <span className="font-medium">Initializing Camera...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleCapture}
          disabled={!isReady || isPending}
          className="
            flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg
            bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))/80]
            text-white shadow-lg shadow-[hsl(var(--primary))/25]
            hover:shadow-xl hover:-translate-y-1
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            transition-all duration-300
          "
        >
          {isPending ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <Camera className="w-6 h-6" />
          )}
          {isPending ? "Processing..." : "Capture Photo"}
        </button>
      </div>
    </div>
  );
}
