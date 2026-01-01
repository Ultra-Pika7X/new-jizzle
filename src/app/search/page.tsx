import { tmdb } from "@/lib/tmdb";
import { MediaCard } from "@/components/common/MediaCard";
import { MediaItem } from "@/types";

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || "";

    let results: MediaItem[] = [];

    if (query) {
        try {
            const data = await tmdb.search(query);
            results = data.results || [];
        } catch (error) {
            console.error("Search failed", error);
        }
    }

    return (
        <div className="container py-10 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">
                Search Results for <span className="text-primary">&quot;{query}&quot;</span>
            </h1>

            {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {results
                        .filter((item: MediaItem) => item.poster_path && (item.media_type === "movie" || item.media_type === "tv"))
                        .map((item: MediaItem) => (
                            <MediaCard key={item.id} item={item} />
                        ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <p className="text-lg">No results found.</p>
                </div>
            )}
        </div>
    );
}
