import { tmdb } from "@/lib/tmdb";
import { Button } from "@/components/ui/Button";
import { Play, Star, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MediaRow } from "@/components/common/MediaRow";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: PageProps) {
    const { id } = await params;
    const movie = await tmdb.getDetails("movie", id);
    const recommendations = movie.recommendations?.results || [];

    const backdropUrl = movie.backdrop_path
        ? (movie.backdrop_path.startsWith("http") ? movie.backdrop_path : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`)
        : null;

    const posterUrl = movie.poster_path
        ? (movie.poster_path.startsWith("http") ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
        : null;

    return (
        <div className="min-h-screen pb-20">
            {/* Hero / Backdrop */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                {backdropUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                        style={{ backgroundImage: `url(${backdropUrl})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
                    </div>
                )}

                <div className="container relative z-10 flex h-full flex-col justify-end pb-12 pt-20">
                    <div className="flex flex-col gap-8 md:flex-row md:items-end">
                        {/* Poster (Hidden on mobile, visible on desktop) */}
                        <div className="hidden md:block relative h-80 w-52 overflow-hidden rounded-lg shadow-2xl shrink-0">
                            {posterUrl ? (
                                <Image src={posterUrl} alt={movie.title} fill className="object-cover" />
                            ) : <div className="h-full w-full bg-muted" />}
                        </div>

                        <div className="flex flex-col gap-4 max-w-3xl">
                            <h1 className="text-4xl font-bold tracking-tight md:text-6xl text-white">
                                {movie.title}
                            </h1>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="text-foreground font-medium">{movie.vote_average?.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{movie.release_date?.split("-")[0]}</span>
                                </div>
                                {movie.runtime && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {movie.genres?.map((g: { id: number; name: string }) => (
                                    <span key={g.id} className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs text-secondary-foreground">
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            <p className="text-lg text-muted-foreground line-clamp-4 md:line-clamp-none">
                                {movie.overview}
                            </p>

                            <div className="flex gap-4 mt-4">
                                <Link href={`https://vidsrc.xyz/embed/movie/${id}`} target="_blank">
                                    <Button size="lg" className="gap-2 text-base font-semibold">
                                        <Play className="h-5 w-5 fill-current" /> Play Movie
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="container mt-10">
                <MediaRow title="You May Also Like" items={recommendations} type="movie" />
            </div>
        </div>
    );
}
