import { useState, useEffect } from 'react';
import { MediaItem } from '@/types';

// Define the Watchlist Item type (extending MediaItem or similar)
// For now, storing the full MediaItem is easiest.
export interface WatchlistItem extends MediaItem {
    addedAt: number;
}

const STORAGE_KEY = 'pstream_watchlist';

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setWatchlist(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse watchlist", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const saveWatchlist = (newList: WatchlistItem[]) => {
        setWatchlist(newList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    };

    const addToWatchlist = (item: MediaItem) => {
        if (isInWatchlist(item.id)) return;

        const newItem: WatchlistItem = {
            ...item,
            addedAt: Date.now(),
        };

        const newList = [newItem, ...watchlist];
        saveWatchlist(newList);
    };

    const removeFromWatchlist = (id: number) => {
        const newList = watchlist.filter(item => item.id !== id);
        saveWatchlist(newList);
    };

    const isInWatchlist = (id: number) => {
        return watchlist.some(item => item.id === id);
    };

    return {
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        isLoaded
    };
}
