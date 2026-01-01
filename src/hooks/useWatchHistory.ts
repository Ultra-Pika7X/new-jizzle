"use client";

import { useState, useEffect } from "react";
import { MediaItem } from "@/types";

export interface WatchHistoryItem extends MediaItem {
    progress: number; // Percentage (0-100)
    timestamp: number; // Last watched timestamp (Date.now())
    playedSeconds: number; // Absolute time in seconds
    duration: number; // Total duration in seconds
}

export function useWatchHistory() {
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);

    useEffect(() => {
        // Load history from localStorage on mount
        const saved = localStorage.getItem("watch-history");
        if (saved) {
            try {
                setHistory(JSON.parse(saved) as WatchHistoryItem[]);
            } catch (e) {
                console.error("Failed to parse watch history", e);
            }
        }
    }, []);

    const saveProgress = (item: MediaItem, progress: number, playedSeconds: number, duration: number) => {
        setHistory((prev) => {
            // Remove existing entry for this item
            const filtered = prev.filter((i) => i.id !== item.id);

            // Create new entry
            const newItem: WatchHistoryItem = {
                ...item,
                progress,
                playedSeconds,
                duration,
                timestamp: Date.now(),
            };

            // Add to front
            const newHistory = [newItem, ...filtered];

            // Persist
            localStorage.setItem("watch-history", JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const removeFromHistory = (id: string | number) => {
        setHistory((prev) => {
            const newHistory = prev.filter(i => i.id !== id);
            localStorage.setItem("watch-history", JSON.stringify(newHistory));
            return newHistory;
        });
    };

    return { history, saveProgress, removeFromHistory };
}
