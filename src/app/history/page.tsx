"use client";

import { useWatchHistory, WatchHistoryItem } from "@/hooks/useWatchHistory";
import { MediaCard } from "@/components/common/MediaCard";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HistoryPage() {
    const { history, removeFromHistory } = useWatchHistory();

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-6">
            <div className="container max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <ArrowLeft className="h-6 w-6 text-white" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Watch History</h1>
                </div>

                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p className="text-lg">No watch history yet.</p>
                        <p className="text-sm mt-2">Start watching something to see it here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {history.map((item: WatchHistoryItem) => (
                            <div key={item.id} className="relative group">
                                <MediaCard
                                    item={item}
                                    type={item.media_type as "movie" | "tv"}
                                />
                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b">
                                    <div
                                        className="h-full bg-primary rounded-b"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromHistory(item.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    title="Remove from history"
                                >
                                    <Trash2 className="h-4 w-4 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
