import { MOVIES } from "@consumet/extensions";
import type { Provider, Stream } from "./types";

class FlixHQProvider implements Provider {
    name = "FlixHQ";
    private client = new MOVIES.FlixHQ();

    async getStream(tmdbId: string, episode?: number, season?: number): Promise<Stream[] | null> {
        try {
            // FlixHQ Search needs a title. We might need a TMDB helper or pass title.
            // For now, let's assume we can't easily map TMDB ID to FlixHQ ID directly without title.
            // But wait, the previous Hianime code searched by title. 
            // We should update the interface or fetch title from TMDB if not provided.
            // For this implementation, I will assume we fetch TMDB details outside or update signature.
            // Let's stick to the interface but fetch TMDB details inside if needed? 
            // Better: update interface to accept title? No, ID is cleaner. 
            // I'll fetch TMDB details here using the existing tmdb lib.

            // Actually, to avoid circular dependencies or complexity, let's just accept that we need to search.
            // PROPOSAL: The Aggregator should take care of fetching metadata if needed, but for now 
            // let's just import our tmdb lib.

            const { tmdb } = await import("@/lib/tmdb");
            const type = season ? "tv" : "movie";
            const details = await tmdb.getDetails(type, tmdbId);

            if (!details) return null;

            const title = details.title || details.name;
            const releaseYear = (details.release_date || "").split("-")[0];

            if (!title) return null;

            const searchResults = await this.client.search(title);

            // Filter by year if possible or exact match
            const match = searchResults.results.find((r: any) => {
                // simple fuzzy match
                return r.title.toLowerCase() === title.toLowerCase() && (r.releaseDate === releaseYear || !r.releaseDate);
            }) || searchResults.results[0];

            if (!match) return null;

            let mediaId = match.id;
            let episodeId = "";

            if (type === "tv") {
                const info = await this.client.fetchMediaInfo(match.id);
                // Find episode
                // FlixHQ episodes usually have structure. Consumet normalizes it.
                // We need to find the episode ID.
                if (!info.episodes) return null;

                const ep = info.episodes.find((e: any) => e.number === episode && e.season === season);
                if (!ep) return null;
                episodeId = ep.id;
                mediaId = info.id; // ensure correct ID context
            } else {
                // Movie
                const info = await this.client.fetchMediaInfo(match.id);
                if (!info.episodes) return null;
                episodeId = info.episodes[0].id;
            }

            const sources = await this.client.fetchEpisodeSources(episodeId, mediaId);

            if (!sources || !sources.sources) return null;

            return sources.sources.map((s: any) => ({
                url: s.url,
                type: "file",
                quality: s.quality === "auto" ? "default" : s.quality,
                isM3U8: s.isM3U8,
            }));

        } catch (error) {
            console.error("FlixHQ Error:", error);
            return null;
        }
    }
}

export const flixhq = new FlixHQProvider();
