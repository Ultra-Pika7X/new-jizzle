"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaCard } from "./MediaCard";
import { MediaItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface MediaRowProps {
    title: string;
    items: MediaItem[];
    type?: "movie" | "tv";
}

export function MediaRow({ title, items, type }: MediaRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { clientWidth, scrollLeft } = rowRef.current;
            const scrollTo =
                direction === "left"
                    ? scrollLeft - clientWidth / 2
                    : scrollLeft + clientWidth / 2;

            rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-2 py-6">
            <div className="flex items-center justify-between px-4 md:px-8">
                <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {title}
                </h2>
            </div>

            <div className="group relative">
                <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center bg-gradient-to-r from-background to-transparent px-2 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-0 pointer-events-none">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full rounded-none hover:bg-transparent pointer-events-auto"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                </div>

                <div
                    ref={rowRef}
                    className="flex gap-4 overflow-x-auto px-4 pb-4 pt-2 scrollbar-hide md:px-8"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {items.map((item) => (
                        <div key={item.id} className="w-[150px] flex-none md:w-[200px]">
                            <MediaCard item={item} type={type || item.media_type as "movie" | "tv"} />
                        </div>
                    ))}
                </div>

                <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center bg-gradient-to-l from-background to-transparent px-2 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full rounded-none hover:bg-transparent pointer-events-auto"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
