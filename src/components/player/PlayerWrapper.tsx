"use client";

import dynamic from "next/dynamic";
import type { SkipTimes } from "@/lib/aniskip";

// Dynamic import with ssr: false is allowed here because this is a Client Component ('use client')
const CustomPlayer = dynamic(() => import("./CustomPlayer").then(mod => mod.CustomPlayer), {
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
    return <CustomPlayer {...props} />;
}
