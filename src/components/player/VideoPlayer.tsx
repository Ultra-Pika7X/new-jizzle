"use client";

import { useState, useRef, useEffect } from "react";
import {
    Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings,
    ArrowLeft, RotateCcw, RotateCw, PictureInPicture, Captions
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VideoPlayerProps {
    src?: string;
    poster?: string;
    title?: string;
    backLink?: string;
    id?: string;
    type?: "movie" | "tv";
}

export function VideoPlayer({ src, poster, title, id, type }: VideoPlayerProps) {
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

    const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);
    const { saveProgress } = useWatchHistory();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            if (video.duration) {
                const currentProgress = (video.currentTime / video.duration) * 100;
                setProgress(currentProgress);
                setCurrentTime(video.currentTime);
            }
        };

        const updateDuration = () => {
            setDuration(video.duration);
        };

        video.addEventListener("timeupdate", updateProgress);
        video.addEventListener("loadedmetadata", updateDuration);
        video.addEventListener("play", () => setIsPlaying(true));
        video.addEventListener("pause", () => setIsPlaying(false));

        return () => {
            video.removeEventListener("timeupdate", updateProgress);
            video.removeEventListener("loadedmetadata", updateDuration);
            video.removeEventListener("play", () => setIsPlaying(true));
            video.removeEventListener("pause", () => setIsPlaying(false));
        };
    }, []);

    // Save progress
    useEffect(() => {
        if (!id || !type) return;

        const save = () => {
            if (videoRef.current && videoRef.current.duration > 0) {
                saveProgress(
                    {
                        id: id,
                        title: title || "Unknown Title",
                        poster_path: poster?.replace("https://image.tmdb.org/t/p/original", "") || "",
                        media_type: type
                    } as any,
                    (videoRef.current.currentTime / videoRef.current.duration) * 100,
                    videoRef.current.currentTime,
                    videoRef.current.duration
                );
            }
        };

        const interval = setInterval(() => {
            if (isPlaying) save();
        }, 5000);

        return () => {
            clearInterval(interval);
            save();
        };
    }, [isPlaying, id, type, title, poster, saveProgress]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const skip = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
            if (newMuted) {
                setVolume(0);
            } else {
                setVolume(1);
                videoRef.current.volume = 1;
            }
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const togglePip = async () => {
        if (videoRef.current) {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
                setIsPip(false);
            } else {
                await videoRef.current.requestPictureInPicture();
                setIsPip(true);
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = (Number(e.target.value) / 100) * duration;
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setProgress(Number(e.target.value));
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const [showSettings, setShowSettings] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    const toggleSettings = () => setShowSettings(!showSettings);

    const changeSpeed = (speed: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
            setPlaybackSpeed(speed);
            setShowSettings(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="group relative h-screen w-full overflow-hidden bg-black font-sans"
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

            {/* Top Bar: Back & Title */}
            <div className={cn(
                "absolute top-0 left-0 right-0 p-6 flex items-center gap-4 transition-all duration-300 z-50 bg-gradient-to-b from-black/80 to-transparent",
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 rounded-full"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h2 className="text-lg font-medium text-white/90 drop-shadow-md">{title}</h2>
                    <p className="text-sm text-white/50">Back to home</p>
                </div>
            </div>

            {/* Settings Overlay */}
            {showSettings && (
                <div className="absolute bottom-24 right-6 w-64 bg-black/90 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md z-[60] animate-in fade-in slide-in-from-bottom-5">
                    <div className="p-3 border-b border-white/10">
                        <h3 className="text-sm font-semibold text-white">Playback Settings</h3>
                    </div>
                    <div className="p-2 space-y-1">
                        <div className="px-2 py-1 text-xs text-gray-400 uppercase tracking-wider">Speed</div>
                        <div className="grid grid-cols-3 gap-1">
                            {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                                <button
                                    key={speed}
                                    onClick={() => changeSpeed(speed)}
                                    className={cn(
                                        "px-2 py-1.5 text-sm rounded-md transition-colors",
                                        playbackSpeed === speed ? "bg-white text-black font-medium" : "text-gray-300 hover:bg-white/10"
                                    )}
                                >
                                    {speed}x
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-2 space-y-1 border-t border-white/10">
                        <div className="px-2 py-1 text-xs text-gray-400 uppercase tracking-wider">Quality</div>
                        <button className="w-full text-left px-3 py-2 text-sm text-white bg-white/5 rounded-md flex justify-between items-center cursor-default">
                            <span>Auto (1080p)</span>
                            <span className="text-xs text-green-400">HD</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Controls Container */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 px-6 pb-6 pt-24 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-300 z-50",
                showControls ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
            )}>
                {/* Progress Bar (Above Controls) */}
                <div className="relative flex h-1.5 w-full cursor-pointer items-center group/slider mb-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="absolute z-20 h-full w-full opacity-0 cursor-pointer"
                    />
                    {/* Background Track */}
                    <div className="absolute top-0 left-0 h-full w-full rounded-full bg-white/20" />
                    {/* Buffered (Optional placeholder) */}

                    {/* Filled Track */}
                    <div
                        className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                    {/* Thumb / Knob */}
                    <div
                        className="absolute top-1/2 -mt-2 h-4 w-4 rounded-full bg-white shadow-lg opacity-0 group-hover/slider:opacity-100 transition-opacity"
                        style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                    />
                </div>

                {/* Buttons Row */}
                <div className="flex items-center justify-between">
                    {/* Left Group */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/10 h-10 w-10">
                            {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
                        </Button>

                        <Button variant="ghost" size="icon" onClick={() => skip(-10)} className="text-white/80 hover:bg-white/10 hover:text-white">
                            <RotateCcw className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => skip(10)} className="text-white/80 hover:bg-white/10 hover:text-white">
                            <RotateCw className="h-5 w-5" />
                        </Button>

                        {/* Volume */}
                        <div className="flex items-center gap-2 group/vol relative">
                            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/10">
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <div className="w-0 overflow-hidden transition-all duration-300 group-hover/vol:w-24 flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                    className="h-1 w-20 rounded-lg accent-white bg-white/30 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="text-sm font-medium text-white/90 font-mono tracking-wider ml-2">
                            {formatTime(currentTime)} / {formatTime(duration || 0)}
                        </div>
                    </div>

                    {/* Right Group */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={togglePip} className="text-white/80 hover:bg-white/10 hover:text-white">
                            <PictureInPicture className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white">
                            <Captions className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleSettings} className={cn("transition-colors", showSettings ? "text-white bg-white/10" : "text-white/80 hover:bg-white/10 hover:text-white")}>
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/10 h-10 w-10">
                            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
