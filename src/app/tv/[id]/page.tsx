import { tmdb } from "@/lib/tmdb";
import { Button } from "@/components/ui/Button";
import { Play, Star, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MediaRow } from "@/components/common/MediaRow";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function TvPage({ params }: PageProps) {
    const { id } = await params;
    const show = await tmdb.getDetails("tv", id);

    if (!show) {
        return <div className="p-20 text-center text-white">TV Show not found</div>;
    }

    const recommendations = show.recommendations?.results || [];

    const backdropUrl = show.backdrop_path
        ? (show.backdrop_path.startsWith("http") ? show.backdrop_path : `https://image.tmdb.org/t/p/original${show.backdrop_path}`)
        : null;

    const posterUrl = show.poster_path
        ? (show.poster_path.startsWith("http") ? show.poster_path : `https://image.tmdb.org/t/p/w500${show.poster_path}`)
        : null;

    return (
        <div className="min-h-screen pb-20">
            {/* Hero / Backdrop */}
            <div className="relative min-h-[70vh] w-full overflow-hidden flex items-end">
                {backdropUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                        style={{ backgroundImage: `url(${backdropUrl})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
                    </div>
                )}

                <div className="container relative z-10 flex h-full flex-col justify-end pb-12 pt-32 md:pt-20">
                    <div className="flex flex-col gap-8 md:flex-row md:items-end">
                        {/* Poster */}
                        <div className="hidden md:block relative h-80 w-52 overflow-hidden rounded-lg shadow-2xl shrink-0">
                            {posterUrl ? (
                                <Image src={posterUrl} alt={show.name} fill className="object-cover" />
                            ) : <div className="h-full w-full bg-muted" />}
                        </div>

                        <div className="flex flex-col gap-4 max-w-3xl">
                            <h1 className="text-4xl font-bold tracking-tight md:text-6xl text-white">
                                {show.name}
                            </h1>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="text-foreground font-medium">{show.vote_average?.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{(show.release_date || "").split("-")[0]}</span>
                                </div>
                                <div>
                                    {/* {show.number_of_seasons} Seasons • {show.number_of_episodes} Episodes */}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {show.genres?.map((g: { id: number; name: string }) => (
                                    <span key={g.id} className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs text-secondary-foreground">
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            <p className="text-lg text-muted-foreground line-clamp-4 md:line-clamp-none">
                                {show.overview}
                            </p>

                            <div className="flex gap-4 mt-4">
                                {/* Default to S1E1 for now */}
                                <Link href={`https://vidsrc.xyz/embed/tv/${id}/1/1`} target="_blank">
                                    <Button size="lg" className="gap-2 text-base font-semibold">
                                        <Play className="h-5 w-5 fill-current" /> Play S1 E1
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="container mt-10">
                <MediaRow title="You May Also Like" items={recommendations} type="tv" />
            </div>
        </div>
    );
}
