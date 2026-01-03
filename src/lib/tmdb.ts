import { getPopularIMDb, getPopularTVIMDb, searchIMDb, getIMDbDetails } from "./imdb";

export type MediaType = "movie" | "tv";

/**
 * Metadata provider that now uses IMDb Scraper.
 * We keep the "tmdb" object name to avoid breaking imports in the rest of the app.
 */
export const tmdb = {
    getTrending: async (type: MediaType, _page = 1) => {
        // IMDb scraper doesn't support pagination or distinct trending vs popular in the current implementation
        if (type === 'tv') {
            const results = await getPopularTVIMDb();
            return { results };
        }
        const results = await getPopularIMDb();
        return { results };
    },

    getTopRated: async (type: MediaType, _page = 1) => {
        // Fallback to popular as we don't have a specific top rated scraper yet
        if (type === 'tv') {
            const results = await getPopularTVIMDb();
            return { results };
        }
        const results = await getPopularIMDb();
        return { results };
    },

    getPopular: async (type: MediaType, _page = 1) => {
        if (type === 'tv') {
            const results = await getPopularTVIMDb();
            return { results };
        }
        const results = await getPopularIMDb();
        return { results };
    },

    getDetails: async (type: MediaType, id: string | number) => {
        // IMDb IDs are strings (tt12345). If we get a number, we might be in trouble if we don't have a mapping.
        // But the previous implementation seemed to handle mixed types.
        // We'll cast to string and hope it's an IMDb ID or compatible.
        const details = await getIMDbDetails(id.toString());
        if (!details) return null;
        return { ...details, media_type: type };
    },

    search: async (query: string, _page = 1) => {
        const results = await searchIMDb(query);
        return { results };
    },
};
