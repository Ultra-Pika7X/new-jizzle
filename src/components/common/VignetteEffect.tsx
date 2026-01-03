"use client";

import { useSettings } from "@/hooks/useSettings";

export function VignetteEffect() {
    const { settings, isLoaded } = useSettings();

    if (!isLoaded || !settings.showVignette) return null;

    return (
        <div
            className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-1000"
            style={{
                background: "radial-gradient(circle at center, transparent 0%, rgba(10, 10, 30, 0.4) 100%)",
                boxShadow: "inset 0 0 100px rgba(0, 50, 255, 0.1)"
            }}
        />
    );
}
