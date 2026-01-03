"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import { MediaCard } from "@/components/common/MediaCard";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function WatchlistPage() {
    const { watchlist, isLoaded, removeFromWatchlist } = useWatchlist();

    if (!isLoaded) return <div className="min-h-screen bg-black" />;

    return (
        <div className="min-h-screen bg-black pb-20 pt-24 text-white">
            <div className="container space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">My List</h1>
                    <span className="text-muted-foreground text-lg font-medium self-end pb-1">
                        {watchlist.length} items
                    </span>
                </div>

                {watchlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                        <div className="text-6xl mb-4">📺</div>
                        <h2 className="text-xl font-semibold mb-2">Your list is empty</h2>
                        <p className="max-w-md mx-auto mb-6">
                            Movies and TV shows you add to your watchlist will appear here.
                        </p>
                        <Link href="/">
                            <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                                Browse Content
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {watchlist.map((item) => (
                            <div key={item.id} className="relative group">
                                <MediaCard item={item} type={item.media_type as "movie" | "tv" || 'movie'} />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFromWatchlist(item.id);
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                                    title="Remove from list"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
