import { MediaRow } from "@/components/common/MediaRow";
import { ContinueWatchingRow } from "@/components/common/ContinueWatchingRow";
import { tmdb } from "@/lib/tmdb";
import { Button } from "@/components/ui/Button";
import { Play, Info, Star } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let trendingMovies: any = { results: [] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let trendingTv: any = { results: [] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let topRatedMovies: any = { results: [] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let popularMovies: any = { results: [] };

  try {
    [
      trendingMovies,
      trendingTv,
      topRatedMovies,
      popularMovies,
    ] = await Promise.all([
      tmdb.getTrending("movie"),
      tmdb.getTrending("tv"),
      tmdb.getTopRated("movie"),
      tmdb.getPopular("movie"),
    ]);
  } catch (error) {
    console.error("Failed to fetch TMDB data:", error);
    // Continue with empty data to avoid crashing the whole page if API key is missing
  }

  const featured = trendingMovies.results[0];

  return (
    <div className="relative min-h-screen pb-20" suppressHydrationWarning>
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          {featured ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
              style={{ backgroundImage: `url(${featured.backdrop_path?.startsWith("http") ? featured.backdrop_path : `https://image.tmdb.org/t/p/original${featured.backdrop_path}`})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
              {/* Vignette effect */}
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
        </div>

        <div className="relative z-30 flex h-full flex-col justify-end px-6 pb-32 md:px-16 lg:w-2/3">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-2xl md:text-7xl lg:text-8xl">
              {featured?.title || featured?.name || "Welcome to Jizzle"}
            </h1>

            <div className="flex items-center gap-3 text-sm font-medium text-white/90">
              {featured?.vote_average && (
                <span className="flex items-center gap-1 text-yellow-400 bg-black/40 px-2 py-1 rounded backdrop-blur-md border border-white/10">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {featured.vote_average.toFixed(1)}
                </span>
              )}
              <span className="bg-primary/80 px-2 py-1 rounded text-white backdrop-blur-md">
                {featured?.media_type === 'tv' ? 'SERIES' : 'MOVIE'}
              </span>
              {featured?.first_air_date && (
                <span className="px-2 py-1 border border-white/20 rounded backdrop-blur-md">
                  {new Date(featured.first_air_date).getFullYear()}
                </span>
              )}
            </div>

            <p className="line-clamp-3 text-lg text-gray-200 md:text-xl max-w-2xl drop-shadow-md leading-relaxed">
              {featured?.overview || "Discover the best movies and TV shows completely free."}
            </p>

            <div className="flex gap-4 pt-4">
              <Link href={`/watch/${featured?.media_type || 'movie'}/${featured?.id}`}>
                <Button size="lg" className="gap-2 text-base font-semibold">
                  <Play className="h-5 w-5 fill-current" /> Watch Now
                </Button>
              </Link>
              <Link href={`/${featured?.media_type || 'movie'}/${featured?.id}`}>
                <Button size="lg" variant="secondary" className="gap-2 text-base font-semibold">
                  <Info className="h-5 w-5" /> More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="relative z-20 -mt-20 space-y-8 pl-4 md:pl-0">
        <ContinueWatchingRow />
        <MediaRow title="Trending Movies" items={trendingMovies.results} type="movie" />
        <MediaRow title="Trending TV Shows" items={trendingTv.results} type="tv" />
        <MediaRow title="Top Rated Movies" items={topRatedMovies.results} type="movie" />
        <MediaRow title="Popular Movies" items={popularMovies.results} type="movie" />
      </div>
    </div>
  );
}
