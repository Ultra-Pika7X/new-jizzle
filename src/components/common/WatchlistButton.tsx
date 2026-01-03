"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import { Button } from "@/components/ui/Button";
import { Plus, Check } from "lucide-react";
import { MediaItem } from "@/types";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
    item: MediaItem;
    className?: string;
}

export function WatchlistButton({ item, className }: WatchlistButtonProps) {
    const { addToWatchlist, removeFromWatchlist, isInWatchlist, isLoaded } = useWatchlist();
    const inList = isInWatchlist(item.id);

    const toggle = () => {
        if (inList) {
            removeFromWatchlist(item.id);
        } else {
            addToWatchlist(item);
        }
    };

    if (!isLoaded) return null; // Or skeleton

    return (
        <Button
            size="lg"
            variant="secondary"
            onClick={toggle}
            className={cn(
                "h-14 px-6 gap-3 text-lg font-semibold rounded-full border border-white/5 backdrop-blur-md transition-all",
                inList
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/20"
                    : "bg-white/10 text-white hover:bg-white/20",
                className
            )}
        >
            {inList ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            {inList ? "In Watchlist" : "Add to Watchlist"}
        </Button>
    );
}
