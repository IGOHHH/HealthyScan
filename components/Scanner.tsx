import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, Loader2, ImagePlus, X, SwitchCamera } from 'lucide-react';

interface ScannerProps {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
}

export const Scanner: React.FC<ScannerProps> = ({ onImageSelected, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Attach stream to video element
  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const startCamera = async () => {
    setError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      setStream(newStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Unable to access camera. Please allow permissions or try uploading a file.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const toggleCamera = async () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    
    // Stop current stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    
    // Start new stream
    try {
        const newStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: newMode }
        });
        setStream(newStream);
    } catch (err) {
        setError("Could not switch camera.");
        setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        
        // Stop camera and pass image
        stopCamera();
        onImageSelected(base64);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Render Camera View
  if (isCameraActive) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Grid Overlay for guiding */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="w-full h-full border-2 border-white/20 grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => <div key={i} className="border border-white/10" />)}
                </div>
            </div>
            
            <div className="absolute top-6 right-6 z-10">
                <button 
                    onClick={stopCamera} 
                    className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-black/90 backdrop-blur-xl px-6 py-8 pb-12 flex items-center justify-around">
            <button 
                onClick={toggleCamera}
                className="p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition"
            >
                <SwitchCamera className="w-6 h-6" />
            </button>

            <button 
                onClick={captureImage}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group"
            >
                <div className="w-16 h-16 bg-white rounded-full transition-transform group-active:scale-90" />
            </button>

            <div className="w-14" /> {/* Spacer for balance */}
        </div>
        
        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // Render Default Dropzone
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-4">
      {error && (
          <div className="mb-4 p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-200 text-sm font-medium flex items-center justify-between">
              {error}
              <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
      )}

      <div 
        className={`relative group border-2 border-dashed rounded-3xl transition-all duration-300 ease-in-out overflow-hidden
          ${dragActive ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-slate-300 bg-white'}
          ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-8">
          {isAnalyzing ? (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Loader2 className="w-16 h-16 text-emerald-600 animate-spin relative z-10" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-semibold text-slate-800">Analyzing Product...</p>
                <p className="text-sm text-slate-500">Identifying ingredients & assessing health impact</p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-800">Scan Product</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm">
                  Use your camera to scan a barcode, label, or product instantly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4">
                  <button 
                    onClick={startCamera}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
                  >
                      <Camera className="w-5 h-5" />
                      Take Photo
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3.5 px-6 rounded-xl font-semibold shadow-sm transition-all hover:-translate-y-0.5"
                  >
                      <Upload className="w-5 h-5" />
                      Upload File
                  </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <ImagePlus className="w-3.5 h-3.5" />
                <span>Supports JPG, PNG, WEBP</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};