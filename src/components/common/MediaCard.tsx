import Image from "next/image";
import Link from "next/link";
import { MediaItem } from "@/types";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface MediaCardProps {
    item: MediaItem;
    className?: string;
    type?: "movie" | "tv";
}

export function MediaCard({ item, className, type }: MediaCardProps) {
    const title = item.title || item.name || "Untitled";
    const date = item.release_date || item.first_air_date;
    const year = date ? new Date(date).getFullYear() : "";
    const mediaType = type || item.media_type || "movie";
    const href = `/${mediaType}/${item.id}`;

    return (
        <Link
            href={href}
            className={cn(
                "group relative flex aspect-[2/3] w-full flex-col overflow-hidden rounded-md bg-card transition-all hover:ring-2 hover:ring-primary hover:z-10",
                className
            )}
        >
            {item.poster_path ? (
                <Image
                    src={item.poster_path.startsWith("http") ? item.poster_path : `https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                    No Image
                </div>
            )}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end h-full">
                <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-400 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                            <Star className="h-3 w-3 fill-current" />
                            {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                        </span>
                        <span className="text-[10px] font-medium text-white/80 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                            {year}
                        </span>
                    </div>
                </div>

                <h3 className="line-clamp-2 text-sm font-semibold text-white leading-tight drop-shadow-md group-hover:text-primary transition-colors">
                    {title}
                </h3>
            </div>
        </Link>
    );
}
