import React from "react";
import { Brain } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full p-4 bg-background/80">
          <Brain className="w-12 h-12 text-primary" />
        </div>
        <div className="text-lg font-medium text-primary-foreground drop-shadow">
          {message}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay; 