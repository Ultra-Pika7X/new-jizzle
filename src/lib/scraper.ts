export interface StreamSource {
    id: string;
    name: string;
    url: string;
    quality?: string;
    isM3U8?: boolean;
    isEmbed?: boolean;
}

export const scraper = {
    getStream: async (type: "movie" | "tv", id: string, season?: string, episode?: string): Promise<StreamSource | null> => {
        // 1. Try VidSrc (Embed)
        // VidSrc usually works like: https://vidsrc.xyz/embed/movie/{id} or /tv/{id}/{season}/{episode}
        const isTv = type === "tv";

        // Construct VidSrc URL
        let vidSrcUrl = `https://vidsrc.xyz/embed/${type}/${id}`;
        if (isTv && season && episode) {
            vidSrcUrl += `/${season}/${episode}`;
        }

        // In a real app, we might want to check if the source actually exists by making a HEAD request
        // For now, we return it as a valid source.

        // We can return a list or just the best one. For now, returning VidSrc as primary.
        return {
            id: "vidsrc",
            name: "VidSrc (Auto)",
            url: vidSrcUrl,
            isEmbed: true,
            quality: "Auto"
        };

        /* 
        // Fallback for testing direct playback (if needed)
        return {
            id: "test-source",
            name: "Test Stream (Big Buck Bunny)",
            url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            quality: "1080p",
            isM3U8: true
        }; 
        */
    }
};
