import { MediaRow } from "@/components/common/MediaRow";
import { ContinueWatchingRow } from "@/components/common/ContinueWatchingRow";
import { tmdb } from "@/lib/tmdb";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const hour = new Date().getHours();
  let greeting = "Tonight";
  if (hour < 12) greeting = "this Morning";
  else if (hour < 18) greeting = "this Afternoon";
  else if (hour < 21) greeting = "this Evening";

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
  }

  async function searchAction(formData: FormData) {
    "use server";
    const query = formData.get("q") as string;
    if (query) {
      redirect(`/search?q=${encodeURIComponent(query)}`);
    }
  }
  return (
    <div className="relative min-h-screen pb-20 pt-20" suppressHydrationWarning>

      {/* Centered Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[50vh] w-full text-center px-4 space-y-8">

        {/* Floating Background Icons/Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-20 pointer-events-none select-none">
          {/* Subtle background elements if needed */}
        </div>

        <div className="relative z-10 space-y-6 max-w-2xl w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
            What would you like to <br className="hidden md:block" /> watch <span className="text-blue-500">{greeting}</span>?
          </h1>

          <form action={searchAction} className="relative w-full max-w-lg mx-auto group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              name="q"
              placeholder="What are you in the mood for?"
              className="w-full h-14 pl-12 pr-4 bg-[#111] border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-xl hover:bg-[#161616]"
              autoComplete="off"
            />
          </form>
        </div>
      </div>

      {/* Rows */}
      <div className="relative z-20 space-y-8 pl-4 md:pl-0 container mx-auto">
        <ContinueWatchingRow />
        <MediaRow title="Trending Movies" items={trendingMovies.results} type="movie" />
        <MediaRow title="Trending TV Shows" items={trendingTv.results} type="tv" />
        <MediaRow title="Top Rated Movies" items={topRatedMovies.results} type="movie" />
        <MediaRow title="Popular Movies" items={popularMovies.results} type="movie" />
      </div>
    </div>
  );
}
