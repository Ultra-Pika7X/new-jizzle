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
            className={cn("group relative flex flex-col gap-2 transition-transform hover:scale-105", className)}
        >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted shadow-lg">
                {item.poster_path ? (
                    <Image
                        src={item.poster_path.startsWith("http") ? item.poster_path : `https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={title}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-bold text-yellow-400 backdrop-blur-sm flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                </div>
            </div>
            <div className="flex flex-col gap-1 px-1">
                <h3 className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-xs text-muted-foreground flex justify-between">
                    <span>{year}</span>
                    <span className="uppercase border border-border px-1 rounded-[2px] text-[10px]">{mediaType}</span>
                </p>
            </div>
        </Link>
    );
}
