"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

/** Low bitrate keeps a minute of video small enough for the site's upload proxy (about 4.5 MB per request). */
const VIDEO_BITS_PER_SECOND = 400_000;
const AUDIO_BITS_PER_SECOND = 32_000;

type Phase = "idle" | "starting" | "recording" | "unavailable";

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return ["video/webm;codecs=vp8,opus", "video/webm", "video/mp4"].find((type) => MediaRecorder.isTypeSupported(type));
}

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/**
 * Records a video live from the camera (front camera, with sound) so the
 * person is really in front of it. If the camera can't be used — no
 * permission, or an unsupported browser — it falls back to choosing a file.
 */
export function VideoRecorder({
  maxSeconds,
  disabled,
  onRecorded,
}: {
  maxSeconds: number;
  disabled?: boolean;
  onRecorded: (file: File) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [message, setMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const releaseCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => releaseCamera, [releaseCamera]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }, []);

  // Counts the seconds while recording and stops by itself at the limit.
  useEffect(() => {
    if (phase !== "recording") return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "recording" && elapsed >= maxSeconds) stop();
  }, [phase, elapsed, maxSeconds, stop]);

  const start = async () => {
    setMessage("");
    const mimeType = pickMimeType();
    if (!navigator.mediaDevices?.getUserMedia || !mimeType) {
      setMessage("Your browser can't record video here.");
      return setPhase("unavailable");
    }

    setPhase("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 24 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: VIDEO_BITS_PER_SECOND, audioBitsPerSecond: AUDIO_BITS_PER_SECOND });
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const type = mimeType.split(";")[0];
        const extension = type === "video/mp4" ? "mp4" : "webm";
        const blob = new Blob(chunksRef.current, { type });
        releaseCamera();
        setPhase("idle");
        onRecorded(new File([blob], `video-kyc.${extension}`, { type }));
      };
      recorderRef.current = recorder;
      recorder.start(1000);
      setElapsed(0);
      setPhase("recording");
    } catch (err) {
      releaseCamera();
      const denied = err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "SecurityError");
      setMessage(denied ? "Camera or microphone access was blocked. Allow it in your browser, or choose a video file instead." : "We couldn't open your camera.");
      setPhase("unavailable");
    }
  };

  const live = phase === "recording" || phase === "starting";

  return (
    <div>
      {/* The preview stays mounted so the camera stream has somewhere to attach as soon as it opens */}
      <div className={`relative overflow-hidden rounded-2xl bg-black ${live ? "block" : "hidden"}`}>
        <video ref={videoRef} muted playsInline className="aspect-[4/3] w-full -scale-x-100 object-cover" />
        {phase === "recording" && (
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            REC {formatTime(elapsed)} / {formatTime(maxSeconds)}
          </div>
        )}
        {phase === "starting" && <p className="absolute inset-0 flex items-center justify-center text-sm text-white">Opening camera…</p>}
      </div>

      {phase === "recording" ? (
        <button type="button" onClick={stop} className="btn btn-lg mt-4 w-full text-white" style={{ background: "var(--error)" }}>
          <span className="h-3 w-3 rounded-sm bg-white" />
          Stop recording
        </button>
      ) : (
        <button type="button" onClick={start} disabled={disabled || phase === "starting"} className="btn btn-primary btn-lg w-full">
          <Icon name="video" className="h-4 w-4" />
          Start Video KYC
        </button>
      )}

      {message && <p className="mt-3 text-xs" style={{ color: "var(--error)" }}>{message}</p>}

      {phase === "unavailable" && (
        <label htmlFor="videoFallback" className="btn btn-outline mt-3 w-full cursor-pointer">
          <Icon name="upload" className="h-4 w-4" />
          Choose a video file instead
          <input
            id="videoFallback"
            type="file"
            accept="video/*"
            capture="user"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onRecorded(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
