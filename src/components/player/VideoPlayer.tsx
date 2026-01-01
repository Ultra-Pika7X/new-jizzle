"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useWatchHistory } from "@/hooks/useWatchHistory";

interface VideoPlayerProps {
    src?: string;
    poster?: string;
    title?: string;
    backLink?: string;
    id?: string; // Add ID for history tracking
    type?: "movie" | "tv"; // Add type for history tracking
}

export function VideoPlayer({ src, poster, title, id, type }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

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

        return () => {
            video.removeEventListener("timeupdate", updateProgress);
            video.removeEventListener("loadedmetadata", updateDuration);
        };
    }, []);

    // Save progress periodically and on pause
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
                    } as any, // Cast to any to fit MediaItem which has strict shape
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
            save(); // Save on unmount
        };
    }, [isPlaying, id, type, title, poster, saveProgress]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
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

    return (
        <div
            ref={containerRef}
            className="group relative aspect-video w-full overflow-hidden bg-black shadow-2xl rounded-xl"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="h-full w-full object-contain"
                onClick={togglePlay}
            />

            {/* Overlay Gradient */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 pointer-events-none",
                showControls ? "opacity-100" : "opacity-0"
            )} />

            {/* Centered Play Button (Visible on Pause or initial load) */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm transition-transform hover:scale-110">
                        <Play className="h-12 w-12 fill-white text-white" />
                    </div>
                </div>
            )}

            {/* Controls Bar */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-4 transition-all duration-300",
                showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            )}>
                {/* Progress Bar */}
                <div className="group/slider relative flex h-2 w-full cursor-pointer items-center">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="absolute z-20 h-full w-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute z-10 h-1 w-full rounded-full bg-white/20 overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-100 group-hover/slider:h-1.5"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    {/* Scrubber Knob */}
                    <div
                        className="absolute z-20 h-3 w-3 rounded-full bg-white shadow opacity-0 transition-opacity group-hover/slider:opacity-100"
                        style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                    />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/10">
                            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
                        </Button>

                        <div className="flex items-center gap-2 group/vol">
                            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/10">
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <div className="w-0 overflow-hidden transition-all duration-300 group-hover/vol:w-24">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                    className="h-1 w-20 rounded-lg bg-gray-600 accent-primary cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="text-xs font-medium text-white/90">
                            {formatTime(currentTime)} / {formatTime(duration || 0)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white truncate max-w-[200px] hidden sm:block">
                            {title}
                        </h3>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/10">
                            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
