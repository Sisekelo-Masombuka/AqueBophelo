import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle, RotateCcw } from 'lucide-react';

/**
 * LiveCameraCapture
 * In-browser live camera viewfinder using getUserMedia API.
 * Captures live photos directly from the device's camera sensor with a shutter button.
 */
export function LiveCameraCapture({
  onCapture,
  onCancel,
  previewUrl = null,
  title = 'Capture Live Proof of Delivery',
  instruction = 'Position camera toward the water discharge nozzle, tanker hose, or community reservoir tank.',
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (selfie/webcam)
  const [cameraError, setCameraError] = useState(null);
  const [capturedPreview, setCapturedPreview] = useState(previewUrl);
  const [isInitializing, setIsInitializing] = useState(false);

  // Start live camera stream
  const startCamera = async (mode = facingMode) => {
    setIsInitializing(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support in-app camera capture.');
      }

      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      setFacingMode(mode);
    } catch (err) {
      console.warn('Camera initialization error:', err);
      let msg = 'Unable to access device camera. Please check camera permissions in your browser.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera device was detected on your hardware.';
      }
      setCameraError(msg);
      setIsCameraActive(false);
    } finally {
      setIsInitializing(false);
    }
  };

  // Stop camera stream tracks to conserve battery and turn off indicator LED
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Automatically start camera on mount if not already showing a captured preview
  useEffect(() => {
    if (!capturedPreview) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, []);

  // Flip front/back camera
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  };

  // Capture frame from active video element onto an HTML5 canvas
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Inlay timestamp & verification watermark for proof of delivery compliance
    const now = new Date();
    const timestampStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString()} CAT • Sol Plaatje GPS Verified`;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, canvas.height - 32, canvas.width, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(timestampStr, 12, canvas.height - 11);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedPreview(dataUrl);

    // Stop active camera stream
    stopCamera();

    // Convert dataUrl to a standard File object for API upload
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `proof_delivery_${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          if (onCapture) {
            onCapture({ file, previewUrl: dataUrl });
          }
        }
      },
      'image/jpeg',
      0.88
    );
  };

  // Reset and retake photo
  const handleRetake = () => {
    setCapturedPreview(null);
    startCamera();
  };

  // Fallback file input change (for environments without webcams)
  const handleFallbackFileInput = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCapturedPreview(reader.result);
      if (onCapture) {
        onCapture({ file, previewUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-50 text-slate-800 rounded-lg p-3 space-y-2 border border-slate-200 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
        <div className="flex items-center space-x-1.5">
          <Camera className="w-3.5 h-3.5 text-[#2e7d32]" />
          <h4 className="text-xs font-bold text-[#152e52]">
            {title}
          </h4>
        </div>
        {isCameraActive && (
          <div className="flex items-center space-x-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="font-semibold tracking-wider">LIVE</span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 leading-tight">
        {instruction}
      </p>

      {/* Main Viewfinder / Photo Container */}
      <div className="relative w-full h-36 sm:h-40 bg-slate-900 rounded-md overflow-hidden flex items-center justify-center border border-slate-300">
        {capturedPreview ? (
          /* Captured Snapshot Preview */
          <div className="relative w-full h-full">
            <img
              src={capturedPreview}
              alt="Live Captured Delivery Proof"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-[#2e7d32] text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
              <Check className="w-3 h-3" /> Photo Attached
            </div>
          </div>
        ) : isCameraActive ? (
          /* Live Active Video Viewfinder */
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Viewfinder crosshairs for centering */}
            <div className="absolute inset-0 pointer-events-none border border-white/20 m-3 rounded-md">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />
            </div>
          </>
        ) : (
          /* Camera Inactive / Loading / Error State */
          <div className="p-3 text-center space-y-1.5">
            {isInitializing ? (
              <div className="flex flex-col items-center space-y-1 text-slate-300 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin text-sky-400" />
                <span>Initializing camera...</span>
              </div>
            ) : cameraError ? (
              <div className="space-y-1.5 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
                <p className="text-slate-200 text-[11px] max-w-xs">{cameraError}</p>
                <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="px-2.5 py-1 bg-[#1d70b8] hover:bg-[#155a96] text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                  <label className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs font-semibold cursor-pointer border border-slate-300">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFallbackFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => startCamera()}
                className="px-3.5 py-1.5 bg-[#2e7d32] hover:bg-[#256629] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" /> Start Live Camera
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center justify-between pt-0.5">
        {capturedPreview ? (
          /* Controls after snapshot taken */
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={handleRetake}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs font-medium flex items-center gap-1 border border-slate-300 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3 h-3 text-amber-500" />
              <span>Retake Photo</span>
            </button>

            <span className="text-[11px] text-[#2e7d32] font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Ready for submission
            </span>
          </div>
        ) : isCameraActive ? (
          /* Controls while camera is live */
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={handleToggleFacingMode}
              title="Switch Front / Back Camera"
              className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-full border border-slate-300 cursor-pointer transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Prominent circular shutter button */}
            <button
              type="button"
              onClick={handleSnapPhoto}
              className="group flex items-center space-x-1.5 px-4 py-1.5 bg-[#2e7d32] hover:bg-[#256629] text-white rounded-full font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white group-hover:scale-110 transition-transform" />
              <span>Snap Photo</span>
            </button>

            <button
              type="button"
              onClick={stopCamera}
              title="Close Camera"
              className="p-1.5 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-full border border-slate-300 cursor-pointer transition-colors shadow-2xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default LiveCameraCapture;
