"use client";

import dynamic from "next/dynamic";
import type { SkipTimes } from "@/lib/aniskip";

const VideoPlayer = dynamic(() => import("./VideoPlayer").then(mod => mod.VideoPlayer), {
    ssr: false,
    loading: () => <div className="w-full aspect-video bg-black flex items-center justify-center text-white/50">Loading Player...</div>
});

interface PlayerWrapperProps {
    src: string;
    poster?: string;
    title?: string;
    skipTimes?: SkipTimes | null;
}

export function PlayerWrapper(props: PlayerWrapperProps) {
    return <VideoPlayer {...props} />;
}
