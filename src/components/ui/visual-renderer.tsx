import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasData, PatternData } from "../../lib/types";
import { Button } from "./button";
import { 
  Maximize2, 
  Download, 
  X, 
  ExternalLink,
  Save
} from "lucide-react";

interface VisualRendererProps {
  type: 'emoji' | 'canvas' | 'pattern' | 'diagram';
  data: string | CanvasData | PatternData;
  description?: string;
  width?: number;
  height?: number;
}

const VisualRenderer: React.FC<VisualRendererProps> = ({ 
  type, 
  data, 
  description, 
  width = 200, 
  height = 150 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);

  // Keyboard shortcuts for fullscreen modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
        } else if (e.key === 'Enter' && !isDownloading) {
          handleDownload();
        }
      } else {
        // Global shortcuts when not in fullscreen
        if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          setIsFullscreen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, isDownloading]);

  const renderCanvas = (canvas: HTMLCanvasElement, canvasData: CanvasData) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    if (canvasData.background) {
      ctx.fillStyle = canvasData.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Render elements
    canvasData.elements.forEach(element => {
      ctx.globalAlpha = element.opacity || 1;
      ctx.fillStyle = element.color;
      ctx.strokeStyle = element.color;

      switch (element.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(
            element.x, 
            element.y, 
            (element.width || 20) / 2, 
            0, 
            2 * Math.PI
          );
          ctx.fill();
          break;

        case 'rectangle':
          ctx.fillRect(
            element.x, 
            element.y, 
            element.width || 30, 
            element.height || 20
          );
          break;

        case 'line':
          ctx.lineWidth = element.height || 2;
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(element.x + (element.width || 50), element.y);
          ctx.stroke();
          break;

        case 'text':
          if (element.text) {
            ctx.font = `${element.fontSize || 16}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(element.text, element.x, element.y);
          }
          break;
      }
    });

    ctx.globalAlpha = 1;
  };

  const renderPattern = useCallback((canvas: HTMLCanvasElement, patternData: PatternData) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { type, colors, size, complexity } = patternData;

    switch (type) {
      case 'grid':
        renderGridPattern(ctx, colors, size, complexity);
        break;
      case 'spiral':
        renderSpiralPattern(ctx, colors, size, complexity);
        break;
      case 'fractal':
        renderFractalPattern(ctx, colors, size, complexity);
        break;
      case 'waves':
        renderWavePattern(ctx, colors, size, complexity);
        break;
      case 'dots':
        renderDotPattern(ctx, colors, size, complexity);
        break;
    }
  }, []);

  const renderGridPattern = (ctx: CanvasRenderingContext2D, colors: string[], size: number, complexity: number) => {
    const gridSize = size;
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    
    for (let x = 0; x < canvasWidth; x += gridSize) {
      for (let y = 0; y < canvasHeight; y += gridSize) {
        if (Math.random() > (1 - complexity / 100)) {
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.fillRect(x, y, gridSize - 2, gridSize - 2);
        }
      }
    }
  };

  const renderSpiralPattern = (ctx: CanvasRenderingContext2D, colors: string[], size: number, complexity: number) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const maxRadius = Math.min(canvasWidth, canvasHeight) / 2;

    for (let i = 0; i < complexity * 10; i++) {
      const angle = i * 0.1;
      const radius = (i / (complexity * 10)) * maxRadius;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, size / 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const renderFractalPattern = (ctx: CanvasRenderingContext2D, colors: string[], size: number, complexity: number) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    
    const drawFractal = (x: number, y: number, size: number, depth: number) => {
      if (depth <= 0) return;

      ctx.fillStyle = colors[depth % colors.length];
      ctx.fillRect(x - size / 2, y - size / 2, size, size);

      const newSize = size / 2;
      drawFractal(x - newSize, y - newSize, newSize, depth - 1);
      drawFractal(x + newSize, y - newSize, newSize, depth - 1);
      drawFractal(x - newSize, y + newSize, newSize, depth - 1);
      drawFractal(x + newSize, y + newSize, newSize, depth - 1);
    };

    drawFractal(canvasWidth / 2, canvasHeight / 2, size * 4, complexity);
  };

  const renderWavePattern = (ctx: CanvasRenderingContext2D, colors: string[], size: number, complexity: number) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    
    for (let i = 0; i < complexity; i++) {
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = 0; x < canvasWidth; x += 5) {
        const y = canvasHeight / 2 + 
                  Math.sin(x * 0.02 + i * 0.5) * 30 + 
                  Math.sin(x * 0.01) * 20;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }
  };

  const renderDotPattern = (ctx: CanvasRenderingContext2D, colors: string[], size: number, complexity: number) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    
    for (let i = 0; i < complexity * 20; i++) {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      const dotSize = Math.random() * size + 2;

      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    if (type === 'canvas' && canvasRef.current) {
      renderCanvas(canvasRef.current, data as CanvasData);
    } else if (type === 'pattern' && canvasRef.current) {
      renderPattern(canvasRef.current, data as PatternData);
    }
  }, [type, data, renderPattern]);

  useEffect(() => {
    if (isFullscreen && fullscreenCanvasRef.current) {
      setIsFullscreenLoading(true);
      // Small delay to show loading state
      setTimeout(() => {
        if (fullscreenCanvasRef.current) {
          if (type === 'canvas') {
            renderCanvas(fullscreenCanvasRef.current, data as CanvasData);
          } else if (type === 'pattern') {
            renderPattern(fullscreenCanvasRef.current, data as PatternData);
          }
        }
        setIsFullscreenLoading(false);
      }, 100);
    }
  }, [isFullscreen, type, data, renderPattern]);

  const downloadCanvas = async (canvas: HTMLCanvasElement, filename: string) => {
    try {
      setIsDownloading(true);
      
      // Create a temporary canvas with higher resolution for download
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Set higher resolution for better quality
      const scale = 2;
      tempCanvas.width = canvas.width * scale;
      tempCanvas.height = canvas.height * scale;
      
      // Scale the context
      tempCtx.scale(scale, scale);
      
      // Copy the original canvas content
      tempCtx.drawImage(canvas, 0, 0);
      
      // Convert to blob and download
      const blob = await new Promise<Blob>((resolve, reject) => {
        tempCanvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/png', 1.0);
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = () => {
    const canvas = isFullscreen ? fullscreenCanvasRef.current : canvasRef.current;
    if (canvas) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `sentium-art-${timestamp}.png`;
      downloadCanvas(canvas, filename);
    }
  };

  const getFullscreenSize = () => {
    const aspectRatio = width / height;
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    
    if (maxWidth / aspectRatio <= maxHeight) {
      return { width: maxWidth, height: maxWidth / aspectRatio };
    } else {
      return { width: maxHeight * aspectRatio, height: maxHeight };
    }
  };

  // Helper function to create emoji canvas for download
  const createEmojiCanvas = (emojiText: string, canvasSize: number, fontSize: number): HTMLCanvasElement | null => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Failed to get 2D context for emoji canvas');
      return null;
    }
    
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emojiText, canvasSize / 2, canvasSize / 2);
    
    return canvas;
  };

  if (type === 'emoji') {
    return (
      <>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="relative group"
        >
          <div 
            className="text-4xl md:text-6xl cursor-pointer" 
            title={description}
            onClick={() => setIsFullscreen(true)}
          >
            {data as string}
          </div>
          
          {/* Action buttons for emoji */}
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
            onClick={() => setIsFullscreen(true)}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            title="View fullscreen (F)"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
            <Button
              onClick={() => {
                const canvas = createEmojiCanvas(data as string, 200, 120);
                if (canvas) {
                  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                  const filename = `sentium-emoji-${timestamp}.png`;
                  downloadCanvas(canvas, filename);
                }
              }}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Emoji Fullscreen Modal */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setIsFullscreen(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-background rounded-xl shadow-2xl border border-border/50 p-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                      <ExternalLink className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Emoji View</h3>
                      {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        const canvas = createEmojiCanvas(data as string, 400, 240);
                        if (canvas) {
                          const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                          const filename = `sentium-emoji-${timestamp}.png`;
                          downloadCanvas(canvas, filename);
                        }
                      }}
                      size="sm"
                      variant="outline"
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setIsFullscreen(false)}
                      size="sm"
                      variant="ghost"
                      className="h-10 w-10 p-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Emoji */}
                <div className="flex items-center justify-center">
                  <div className="text-8xl md:text-9xl">
                    {data as string}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  const fullscreenSize = getFullscreenSize();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative group"
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="rounded-lg border border-border/50 shadow-sm cursor-pointer"
          title={description}
          onClick={() => setIsFullscreen(true)}
        />
        
        {/* Action buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            onClick={() => setIsFullscreen(true)}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleDownload}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            disabled={isDownloading}
            title="Download image"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {description && (
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {description}
          </div>
        )}
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-background rounded-xl shadow-2xl border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                    <ExternalLink className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Fullscreen View</h3>
                    {description && (
                      <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    variant="outline"
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsFullscreen(false)}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

                              {/* Canvas */}
                <div className="p-6 relative">
                  {isFullscreenLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading...</span>
                      </div>
                    </div>
                  )}
                  <canvas
                    ref={fullscreenCanvasRef}
                    width={fullscreenSize.width}
                    height={fullscreenSize.height}
                    className="rounded-lg border border-border/50 shadow-lg"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain'
                    }}
                  />
                  
                  {/* Keyboard shortcuts info */}
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-4 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                      <span>Press <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs">Esc</kbd> to close</span>
                      <span>Press <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs">Enter</kbd> to download</span>
                    </div>
                  </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VisualRenderer; 