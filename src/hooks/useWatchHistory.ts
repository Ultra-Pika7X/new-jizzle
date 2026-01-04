"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

export interface WatchHistoryItem extends MediaItem {
    progress: number; // Percentage (0-100)
    timestamp: number; // Last watched timestamp (Date.now())
    playedSeconds: number; // Absolute time in seconds
    duration: number; // Total duration in seconds
}

const LOCAL_STORAGE_KEY = "watch-history";

export function useWatchHistory() {
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { user } = useAuth();

    // Load history on mount
    useEffect(() => {
        const loadHistory = async () => {
            let localHistory: WatchHistoryItem[] = [];

            // 1. Load from localStorage
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                try {
                    localHistory = JSON.parse(saved) as WatchHistoryItem[];
                } catch (e) {
                    console.error("Failed to parse local watch history", e);
                }
            }

            // 2. If logged in, fetch from Firestore and merge
            if (user) {
                try {
                    const historyRef = collection(db, "users", user.uid, "watchHistory");
                    const snapshot = await getDocs(historyRef);
                    const cloudHistory: WatchHistoryItem[] = [];
                    snapshot.forEach((docSnap) => {
                        cloudHistory.push(docSnap.data() as WatchHistoryItem);
                    });

                    // Merge: Cloud takes precedence if same item, but local adds new items
                    const merged = [...cloudHistory];
                    localHistory.forEach((localItem) => {
                        const existsInCloud = merged.some(c => String(c.id) === String(localItem.id));
                        if (!existsInCloud) {
                            merged.push(localItem);
                        }
                    });

                    // Sort by timestamp descending
                    merged.sort((a, b) => b.timestamp - a.timestamp);

                    // Sync merged data back to Firestore
                    for (const item of merged) {
                        await setDoc(doc(db, "users", user.uid, "watchHistory", String(item.id)), item);
                    }

                    setHistory(merged);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
                } catch (e) {
                    console.error("Failed to load cloud watch history", e);
                    setHistory(localHistory);
                }
            } else {
                setHistory(localHistory);
            }

            setIsLoaded(true);
        };

        loadHistory();
    }, [user]);

    const saveProgress = useCallback(async (item: MediaItem, progress: number, playedSeconds: number, duration: number) => {
        const newItem: WatchHistoryItem = {
            ...item,
            progress,
            playedSeconds,
            duration,
            timestamp: Date.now(),
        };

        setHistory((prev) => {
            const filtered = prev.filter((i) => String(i.id) !== String(item.id));
            const newHistory = [newItem, ...filtered];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
            return newHistory;
        });

        // Sync to Firestore if logged in
        if (user) {
            try {
                await setDoc(doc(db, "users", user.uid, "watchHistory", String(item.id)), newItem);
            } catch (e) {
                console.error("Failed to save to Firestore", e);
            }
        }
    }, [user]);

    const removeFromHistory = useCallback(async (id: string | number) => {
        setHistory((prev) => {
            const newHistory = prev.filter(i => String(i.id) !== String(id));
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
            return newHistory;
        });

        // Remove from Firestore if logged in
        if (user) {
            try {
                await deleteDoc(doc(db, "users", user.uid, "watchHistory", String(id)));
            } catch (e) {
                console.error("Failed to remove from Firestore", e);
            }
        }
    }, [user]);

    return { history, saveProgress, removeFromHistory, isLoaded };
}
