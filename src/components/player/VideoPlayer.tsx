"use client";

import { useState, useRef, useEffect } from "react";
import {
    Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings,
    ArrowLeft, RotateCcw, RotateCw, PictureInPicture, Captions, HelpCircle, Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useRouter } from "next/navigation";
import { ServerSelect } from "./ServerSelect";
import type { SkipTimes } from "@/lib/aniskip";

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
    backLink?: string;
    id?: string;
    type?: "movie" | "tv";
    skipTimes?: SkipTimes | null;
}

export function VideoPlayer({ src, poster, title, id, type, skipTimes }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPip, setIsPip] = useState(false);

    // Skip Button State
    const [showSkipOp, setShowSkipOp] = useState(false);
    const [showSkipEd, setShowSkipEd] = useState(false);

    const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);
    const { saveProgress } = useWatchHistory();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            setCurrentTime(video.currentTime);
            if (video.duration) {
                const currentProgress = (video.currentTime / video.duration) * 100;
                setProgress(currentProgress);
            }

            // Check Skip Times
            if (skipTimes?.op) {
                setShowSkipOp(video.currentTime >= skipTimes.op.start && video.currentTime < skipTimes.op.end);
            }
            if (skipTimes?.ed) {
                setShowSkipEd(video.currentTime >= skipTimes.ed.start && video.currentTime < skipTimes.ed.end);
            }
        };

        const updateDuration = () => setDuration(video.duration);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        video.addEventListener("timeupdate", updateProgress);
        video.addEventListener("loadedmetadata", updateDuration);
        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onPause);

        return () => {
            video.removeEventListener("timeupdate", updateProgress);
            video.removeEventListener("loadedmetadata", updateDuration);
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onPause);
        };
    }, [skipTimes]);

    // Save progress logic (same as before)
    useEffect(() => {
        if (!id || !type) return;
        const save = () => {
            if (videoRef.current && videoRef.current.duration > 0) {
                saveProgress(
                    { id, title: title || "Unknown", poster_path: poster || "", media_type: type } as any,
                    (videoRef.current.currentTime / videoRef.current.duration) * 100,
                    videoRef.current.currentTime,
                    videoRef.current.duration
                );
            }
        };
        const interval = setInterval(() => { if (isPlaying) save(); }, 5000);
        return () => { clearInterval(interval); save(); };
    }, [isPlaying, id, type, title, poster, saveProgress]);

    // Controls Logic
    const togglePlay = () => videoRef.current?.paused ? videoRef.current.play() : videoRef.current?.pause();
    const skip = (seconds: number) => { if (videoRef.current) videoRef.current.currentTime += seconds; };
    const handleVolume = (val: number) => {
        if (videoRef.current) {
            videoRef.current.volume = val;
            setVolume(val);
            setIsMuted(val === 0);
        }
    };
    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
            videoRef.current.volume = newMuted ? 0 : 1;
            setVolume(newMuted ? 0 : 1);
        }
    };
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };
    const togglePip = async () => {
        document.pictureInPictureElement ? document.exitPictureInPicture() : videoRef.current?.requestPictureInPicture();
    };
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = (val / 100) * duration;
            setProgress(val);
        }
    };
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => { if (isPlaying) setShowControls(false); }, 3000);
    };

    const formatTime = (time: number) => {
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s < 10 ? `0${s}` : s}`;
    };

    const handleSkipIntroOutro = (endTime: number) => {
        if (videoRef.current) videoRef.current.currentTime = endTime;
    };

    return (
        <div
            ref={containerRef}
            className="group relative h-full w-full bg-black overflow-hidden font-sans select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="h-full w-full object-contain"
                onClick={togglePlay}
                playsInline
            />

            {/* Skip Buttons Overlay */}
            {(showSkipOp && skipTimes?.op) && (
                <div className="absolute bottom-24 left-6 z-40 animate-in fade-in slide-in-from-left-4">
                    <Button onClick={() => handleSkipIntroOutro(skipTimes.op!.end)} className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10">
                        Skip Intro
                    </Button>
                </div>
            )}
            {(showSkipEd && skipTimes?.ed) && (
                <div className="absolute bottom-24 left-6 z-40 animate-in fade-in slide-in-from-left-4">
                    <Button onClick={() => handleSkipIntroOutro(skipTimes.ed!.end)} className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10">
                        Skip Outro
                    </Button>
                </div>
            )}

            {/* Top Bar */}
            <div className={cn(
                "absolute top-0 left-0 right-0 p-6 flex items-center justify-between transition-all duration-300 z-50 bg-gradient-to-b from-black/80 to-transparent",
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                {/* Left: Back */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10 rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="text-sm text-white/70 hidden sm:block">Back to home</div>
                </div>

                {/* Center: Title (Visible only if enough space, or truncate) */}
                <div className="absolute left-1/2 -translate-x-1/2 max-w-[40%] text-center hidden md:block">
                    <h2 className="text-lg font-medium text-white/90 drop-shadow-md truncate">{title}</h2>
                </div>

                {/* Right: Icons */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                        <Bookmark className="h-5 w-5" />
                    </Button>
                    <ServerSelect currentServer="vidsrc" onServerChange={() => { }} />
                </div>
            </div>

            {/* Bottom Controls */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 px-6 pb-6 pt-24 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-300 z-50",
                showControls ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
            )}>
                {/* Progress Bar */}
                <div className="relative flex h-1 w-full cursor-pointer items-center group/slider mb-4">
                    <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="absolute z-20 h-full w-full opacity-0 cursor-pointer" />
                    <div className="absolute h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/80 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="absolute h-3 w-3 bg-white rounded-full shadow-lg opacity-0 group-hover/slider:opacity-100 transition-opacity" style={{ left: `${progress}%`, transform: 'translateX(-50%)' }} />
                </div>

                <div className="flex items-center justify-between">
                    {/* Left Controls */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/10 h-10 w-10">
                            {isPlaying ? <Pause className="h-7 w-7 fill-white" /> : <Play className="h-7 w-7 fill-white" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => skip(-10)} className="text-white/80 hover:text-white">
                            <RotateCcw className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => skip(10)} className="text-white/80 hover:text-white">
                            <RotateCw className="h-5 w-5" />
                        </Button>

                        {/* Volume */}
                        <div className="flex items-center gap-2 group/vol">
                            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white/80 hover:text-white">
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <input type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={(e) => handleVolume(Number(e.target.value))} className="w-0 group-hover/vol:w-20 transition-all h-1 accent-white bg-white/30 rounded-lg cursor-pointer" />
                        </div>

                        <div className="text-sm font-medium text-white/90 font-mono">
                            {formatTime(currentTime)} / {formatTime(duration || 0)}
                        </div>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={togglePip} className="text-white/80 hover:text-white">
                            <PictureInPicture className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                            <Captions className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white/80 hover:text-white">
                            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
