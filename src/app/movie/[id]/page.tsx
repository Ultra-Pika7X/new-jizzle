import { tmdb } from "@/lib/tmdb";
import { Button } from "@/components/ui/Button";
import { Play, Star, Calendar, Clock, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MediaRow } from "@/components/common/MediaRow";
import { WatchlistButton } from "@/components/common/WatchlistButton";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: PageProps) {
    const { id } = await params;
    const movie = await tmdb.getDetails("movie", id);

    if (!movie) {
        return <div className="flex h-screen items-center justify-center text-white">Movie not found</div>;
    }

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
            <div className="relative min-h-[85vh] w-full overflow-hidden flex items-end">
                {backdropUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${backdropUrl})` }}
                    >
                        {/* Vignette & Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/60 to-transparent" />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                )}

                <div className="container relative z-10 flex h-full flex-col justify-end pb-16 md:pb-24 pt-32">
                    <div className="flex flex-col gap-8 md:flex-row md:items-end">
                        {/* Poster */}
                        <div className="hidden md:block relative h-[450px] w-[300px] overflow-hidden rounded-xl shadow-2xl shrink-0 border border-white/10 group">
                            {posterUrl ? (
                                <Image src={posterUrl} alt={movie.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : <div className="h-full w-full bg-muted" />}
                        </div>

                        <div className="flex flex-col gap-6 max-w-4xl">
                            <h1 className="text-5xl font-black tracking-tight md:text-7xl text-white drop-shadow-xl leading-none">
                                {movie.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300">
                                <div className="flex items-center gap-1.5 text-yellow-400">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="text-white text-base">{movie.vote_average?.toFixed(1)}</span>
                                </div>
                                <span className="text-gray-600">•</span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    <span>{movie.release_date?.split("-")[0]}</span>
                                </div>
                                <span className="text-gray-600">•</span>
                                {movie.runtime && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {movie.genres?.map((g: { id: number; name: string }) => (
                                    <span key={g.id} className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200 backdrop-blur-sm">
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            <p className="text-lg text-gray-300 line-clamp-4 md:line-clamp-none max-w-2xl leading-relaxed">
                                {movie.overview}
                            </p>

                            <div className="flex gap-4 mt-2">
                                <Link href={`/watch/movie/${id}`}>
                                    <Button size="lg" className="h-14 px-8 gap-3 text-lg font-bold rounded-full bg-white text-black hover:bg-gray-200 transition-all hover:scale-105">
                                        <Play className="h-6 w-6 fill-black" />
                                        Play Now
                                    </Button>
                                </Link>
                                <WatchlistButton item={movie} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="container mt-0 relative z-20">
                <MediaRow title="You May Also Like" items={recommendations} type="movie" />
            </div>
        </div>
    );
}
