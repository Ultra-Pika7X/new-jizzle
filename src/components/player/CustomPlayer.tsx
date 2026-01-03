"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider, Poster, Track, useMediaStore, type MediaPlayerInstance } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import type { SkipTimes } from "@/lib/aniskip";

interface CustomPlayerProps {
    src: string;
    poster?: string;
    title?: string;
    subtitles?: { label: string; src: string; lang: string }[];
    onEnded?: () => void;
    skipTimes?: SkipTimes | null;
}

export function CustomPlayer({ src, poster, title, subtitles, onEnded, skipTimes }: CustomPlayerProps) {
    const player = useRef<MediaPlayerInstance>(null);

    const handleSkip = (time: number) => {
        if (player.current) {
            player.current.currentTime = time;
        }
    };

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/5">
            <MediaPlayer
                ref={player}
                title={title}
                src={src}
                onEnded={onEnded}
                aspectRatio="16/9"
                load="eager"
                streamType="on-demand"
            >
                <MediaProvider>
                    {poster && <Poster className="vds-poster" src={poster} alt={title} />}
                    {subtitles?.map((sub, i) => (
                        <Track key={String(i)} src={sub.src} label={sub.label} lang={sub.lang} kind="subtitles" default={i === 0} />
                    ))}
                </MediaProvider>

                <DefaultVideoLayout icons={defaultLayoutIcons} />

                {/* Skip Intro Overlay */}
                {skipTimes?.op && (
                    <VideoTimeCheck
                        startTime={skipTimes.op.start}
                        endTime={skipTimes.op.end}
                    >
                        {(isActive) => isActive && (
                            <div className="absolute bottom-20 left-4 z-50 animate-in fade-in slide-in-from-left-4">
                                <Button
                                    onClick={() => handleSkip(skipTimes.op!.end)}
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md"
                                >
                                    Skip Intro
                                </Button>
                            </div>
                        )}
                    </VideoTimeCheck>
                )}

                {/* Skip Outro Overlay */}
                {skipTimes?.ed && (
                    <VideoTimeCheck
                        startTime={skipTimes.ed.start}
                        endTime={skipTimes.ed.end}
                    >
                        {(isActive) => isActive && (
                            <div className="absolute bottom-20 left-4 z-50 animate-in fade-in slide-in-from-left-4">
                                <Button
                                    onClick={() => handleSkip(skipTimes.ed!.end)}
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md"
                                >
                                    Skip Outro
                                </Button>
                            </div>
                        )}
                    </VideoTimeCheck>
                )}
            </MediaPlayer>
        </div>
    );
}

function VideoTimeCheck({ startTime, endTime, children }: { startTime: number, endTime: number, children: (isActive: boolean) => React.ReactNode }) {
    const { currentTime } = useMediaStore();
    const isActive = currentTime >= startTime && currentTime < endTime;
    return <>{children(isActive)}</>;
}
