import { getStream } from "@/lib/providers";
import { getMalId, getSkipTimes } from "@/lib/aniskip";
import { PlayerWrapper } from "@/components/player/PlayerWrapper";
import { tmdb } from "@/lib/tmdb";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string[] }>;
    searchParams: Promise<{ s?: string; e?: string }>;
}

export default async function WatchPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { s, e } = await searchParams;

    const type = id[0] as "movie" | "tv";
    const mediaId = id[1];

    let title = "Watching";
    let poster = "";

    // Fetch Metadata for UI
    const details = await tmdb.getDetails(type, mediaId);

    if (!details) {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                <p>Content not found</p>
            </div>
        );
    }

    try {
        title = details.title || details.name || "Watching";
        if (type === "tv" && s && e) {
            title += ` - S${s} E${e}`;
        }
        if (details.backdrop_path) {
            poster = details.backdrop_path.startsWith("http")
                ? details.backdrop_path
                : `https://image.tmdb.org/t/p/original${details.backdrop_path}`;
        }

        // Determine if Anime based on metadata
        const isAnime = details.original_language === "ja" && details.genres?.some((g: any) => g.name === "Animation");

        const episodeNum = e ? parseInt(e) : 1;
        const seasonNum = s ? parseInt(s) : undefined;

        // Parallel Data Fetching
        const streamPromise = getStream(mediaId, episodeNum, seasonNum, isAnime);

        // Skip times only for Anime
        const skipPromise = isAnime ? (async () => {
            const malId = await getMalId(title.split(" - S")[0]);
            if (malId) {
                return await getSkipTimes(malId, episodeNum);
            }
            return null;
        })() : Promise.resolve(null);

        const [stream, skipTime] = await Promise.all([streamPromise, skipPromise]);

        return (
            <div className="flex h-screen w-full flex-col bg-black">
                <div className="flex-1 relative group">
                    <Link href={`/${type}/${mediaId}`} className="absolute top-4 left-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button variant="ghost" size="icon" className="text-white bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-md">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>

                    {stream ? (
                        stream.type === "embed" ? (
                            <div className="w-full h-full">
                                <iframe
                                    src={stream.url}
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                        ) : (
                            <PlayerWrapper
                                src={stream.url}
                                poster={poster}
                                title={title}
                                skipTimes={skipTime}
                            />
                        )
                    ) : (
                        <div className="flex flex-col h-full w-full items-center justify-center bg-black text-white space-y-4">
                            <p className="text-xl font-medium text-red-400">Stream not found.</p>
                            <p className="text-sm text-gray-400 max-w-md text-center">
                                We couldn't find a direct link or embed for this content from our providers (FlixHQ, VidSrc, Hianime).
                            </p>
                            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Watch page error:", error);
        return (
            <div className="flex h-screen items-center justify-center text-white">
                <p>Something went wrong.</p>
            </div>
        );
    }
}
