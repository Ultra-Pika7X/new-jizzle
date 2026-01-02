import { getPopularIMDb, getPopularTVIMDb, searchIMDb, getIMDbDetails } from "./imdb";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export type MediaType = "movie" | "tv";

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
    if (!TMDB_API_KEY) throw new Error("TMDB_API_KEY is missing");

    const queryParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: "en-US",
        ...params,
    });

    const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

    const res = await fetch(url, {
        next: { revalidate: 3600 },
        headers: {
            accept: "application/json",
        },
    });

    if (!res.ok) {
        throw new Error(`TMDB Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

/**
 * IMDB-based metadata provider that replaces TMDB.
 * We keep the "tmdb" object name to avoid breaking imports in the rest of the app.
 */
export const tmdb = {
    getTrending: async (type: MediaType, page = 1) => {
        try {
            if (TMDB_API_KEY) {
                return fetchTMDB(`/discover/${type}`, { 
                    page: page.toString(),
                    sort_by: "popularity.desc",
                    with_genres: "16",
                    with_original_language: "ja"
                });
            }
        } catch (e) {
            console.error("TMDB error:", e);
        }
        return { results: [] };
    },

    getTopRated: async (type: MediaType, page = 1) => {
        try {
            if (TMDB_API_KEY) {
                return fetchTMDB(`/discover/${type}`, { 
                    page: page.toString(),
                    sort_by: "vote_average.desc",
                    "vote_count.gte": "200",
                    with_genres: "16",
                    with_original_language: "ja"
                });
            }
        } catch (e) { }
        return { results: [] };
    },

    getPopular: async (type: MediaType, page = 1) => {
        try {
            if (TMDB_API_KEY) {
                return fetchTMDB(`/discover/${type}`, { 
                    page: page.toString(),
                    sort_by: "popularity.desc",
                    with_genres: "16",
                    with_original_language: "ja"
                });
            }
        } catch (e) { }
        return { results: [] };
    },

    getDetails: async (type: MediaType, id: string | number) => {
        try {
            // If ID is an IMDb ID (starts with tt)
            if (typeof id === "string" && id.startsWith("tt")) {
                const details = await getIMDbDetails(id);
                if (details) return details;
            }

            // Otherwise try TMDB
            if (TMDB_API_KEY) return fetchTMDB(`/${type}/${id}`, { append_to_response: "credits,videos,images,recommendations" });
        } catch (e) { }

        // Mock fallback if both fail
        return {
            id: id,
            title: "Movie Preview",
            name: "Show Preview",
            overview: "Details could not be loaded from IMDb or TMDB.",
            poster_path: null,
            backdrop_path: null,
            release_date: "2024",
            vote_average: 0,
            recommendations: { results: [] },
            seasons: [],
            genres: []
        };
    },

    search: async (query: string, page = 1) => {
        try {
            const results = await searchIMDb(query);
            if (results && results.length > 0) return { results };
            if (TMDB_API_KEY) return fetchTMDB("/search/multi", { query, page: page.toString() });
        } catch (e) { }
        return { results: [] };
    },
};
