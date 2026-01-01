import { MediaRow } from "@/components/common/MediaRow";
import { ContinueWatchingRow } from "@/components/common/ContinueWatchingRow";
import { tmdb } from "@/lib/tmdb";
import { Button } from "@/components/ui/Button";
import { Play, Info } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  let trendingMovies: any = { results: [] };
  let trendingTv: any = { results: [] };
  let topRatedMovies: any = { results: [] };
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
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          {featured ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${featured.backdrop_path?.startsWith("http") ? featured.backdrop_path : `https://image.tmdb.org/t/p/original${featured.backdrop_path}`})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>

        <div className="relative z-30 flex h-full flex-col justify-end px-4 pb-20 md:px-12 lg:w-1/2">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            {featured?.title || featured?.name || "Welcome to Jizzle Stream"}
          </h1>
          <p className="mb-6 line-clamp-3 text-lg text-muted-foreground md:text-xl">
            {featured?.overview || "Discover the best movies and TV shows completely free."}
          </p>
          <div className="flex gap-4">
            <Link href={`https://vidsrc.xyz/embed/${featured?.media_type || 'movie'}/${featured?.id}`} target="_blank">
              <Button size="lg" className="gap-2 text-base font-semibold">
                <Play className="h-5 w-5 fill-current" /> Play Now
              </Button>
            </Link>
            <Link href={`/${featured?.media_type || 'movie'}/${featured?.id}`}>
              <Button size="lg" variant="outline" className="gap-2 text-base font-semibold">
                <Info className="h-5 w-5" /> More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="relative z-20 -mt-32 space-y-8 pl-4 md:pl-0">
        <ContinueWatchingRow />
        <MediaRow title="Trending Movies" items={trendingMovies.results} type="movie" />
        <MediaRow title="Trending TV Shows" items={trendingTv.results} type="tv" />
        <MediaRow title="Top Rated Movies" items={topRatedMovies.results} type="movie" />
        <MediaRow title="Popular Movies" items={popularMovies.results} type="movie" />
      </div>
    </div>
  );
}
