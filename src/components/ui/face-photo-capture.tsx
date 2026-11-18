"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

type Phase = "idle" | "starting" | "live";

/**
 * Face photo for ID matching: "Take photo" opens the front camera in the page and captures a still,
 * "Choose file" picks an existing image. If the camera can't be used (no permission, no camera, an
 * unsupported browser) the person is told and can still choose a file.
 */
export function FacePhotoCapture({
  file,
  onChange,
  disabled,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);
  useEffect(() => stopCamera, [stopCamera]);

  const openCamera = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("This browser can't open the camera. Use “Choose file” instead.");
      return;
    }
    setPhase("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
      streamRef.current = stream;
      setPhase("live");
    } catch (err) {
      const blocked = err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "SecurityError");
      setError(blocked ? "Camera access was blocked. Allow it in your browser, or use “Choose file”." : "We couldn't open your camera. Use “Choose file” instead.");
      setPhase("idle");
    }
  };

  // The <video> element only exists once the phase is "live", so attach the stream then.
  useEffect(() => {
    if (phase !== "live" || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    void videoRef.current.play().catch(() => {});
  }, [phase]);

  const cancel = () => {
    stopCamera();
    setPhase("idle");
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    // Centre square crop so the face fills the circle.
    const side = Math.min(video.videoWidth, video.videoHeight);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = Math.min(side, 1024);
    canvas.getContext("2d")?.drawImage(video, (video.videoWidth - side) / 2, (video.videoHeight - side) / 2, side, side, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return setError("Couldn't capture the photo. Please try again.");
        onChange(new File([blob], `face-${Date.now()}.jpg`, { type: "image/jpeg" }));
        stopCamera();
        setPhase("idle");
      },
      "image/jpeg",
      0.9
    );
  };

  const live = phase === "live";
  const buttonBase = `btn w-full ${disabled ? "pointer-events-none opacity-50" : ""}`;

  return (
    <div>
      <div className="flex justify-center">
        <div
          className="relative flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border-2"
          style={{ borderColor: file || live ? "var(--primary)" : "var(--line)", background: "var(--primary-soft)" }}
        >
          {live ? (
            // The preview is mirrored like a selfie; the captured photo is not.
            <video ref={videoRef} muted playsInline className="h-full w-full -scale-x-100 object-cover" />
          ) : preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Your face" className="h-full w-full object-cover" />
          ) : (
            <Icon name="user" className="h-20 w-20" style={{ color: "var(--primary)" }} />
          )}
          {phase === "starting" && <div className="shimmer absolute inset-0" />}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {live ? (
          <>
            <button type="button" onClick={capture} className={`${buttonBase} btn-primary`}>
              <Icon name="check" className="h-4 w-4" /> Capture
            </button>
            <button type="button" onClick={cancel} className={`${buttonBase} btn-outline`}>Cancel</button>
          </>
        ) : (
          <>
            <button type="button" onClick={openCamera} disabled={phase === "starting"} className={`${buttonBase} btn-outline`}>
              <Icon name="user" className="h-4 w-4" />
              {phase === "starting" ? "Opening camera…" : file ? "Retake photo" : "Take photo"}
            </button>
            <label htmlFor="facePhotoFile" className={`${buttonBase} btn-outline cursor-pointer`}>
              <Icon name="upload" className="h-4 w-4" /> Choose file
            </label>
            <input
              id="facePhotoFile"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={disabled}
              onChange={(e) => { onChange(e.target.files?.[0] ?? null); setError(""); e.target.value = ""; }}
            />
          </>
        )}
      </div>

      {error && <p className="mt-2 text-xs" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}
