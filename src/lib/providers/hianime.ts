import { ANIME } from "@consumet/extensions";
import type { Provider, Stream } from "./types";

class HianimeProvider implements Provider {
    name = "Hianime";
    private client = new ANIME.Hianime();

    async getStream(tmdbId: string, episode: number = 1): Promise<Stream[] | null> {
        try {
            // Need title from TMDB
            const { tmdb } = await import("@/lib/tmdb");
            // Hianime is usually for Anime, which can be Movie or TV. 
            // We can check 'movie' first then 'tv' or rely on what calls us.
            // But usually this providers is called when we know it's anime.
            // Let's assume we try to get details as TV first (most anime) then movie?
            // Or better, search broadly.

            let title = "";
            // Try to find if it's a TV show first
            let details = await tmdb.getDetails("tv", tmdbId);
            if (!details) {
                details = await tmdb.getDetails("movie", tmdbId);
            }

            if (!details) return null;
            title = details.name || details.title;

            if (!title) return null;

            const searchResults = await this.client.search(title);
            if (!searchResults.results.length) return null;

            // Simple match: first result
            const animeId = searchResults.results[0].id;

            const info = await this.client.fetchAnimeInfo(animeId);

            if (!info.episodes) return null;

            const targetEp = info.episodes.find((e: any) => e.number === episode) || info.episodes[0];
            if (!targetEp) return null;

            const sources = await this.client.fetchEpisodeSources(targetEp.id);

            if (!sources || !sources.sources) return null;

            return sources.sources.map((s: any) => ({
                url: s.url,
                type: "file",
                quality: s.quality === "auto" ? "default" : s.quality,
                isM3U8: s.isM3U8,
            }));

        } catch (error) {
            console.error("Hianime Error:", error);
            return null;
        }
    }
}

export const hianime = new HianimeProvider();
