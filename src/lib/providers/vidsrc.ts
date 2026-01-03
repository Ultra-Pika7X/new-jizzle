import type { Provider, Stream } from "./types";

class VidSrcProvider implements Provider {
    name = "VidSrc";
    private baseUrl = "https://vidsrc.to/embed";

    async getStream(tmdbId: string, episode?: number, season?: number): Promise<Stream[] | null> {
        try {
            // VidSrc.to structure: 
            // Movie: https://vidsrc.to/embed/movie/{tmdbId}
            // TV: https://vidsrc.to/embed/tv/{tmdbId}/{season}/{episode}

            let url = "";
            if (season && episode) {
                url = `${this.baseUrl}/tv/${tmdbId}/${season}/${episode}`;
            } else {
                url = `${this.baseUrl}/movie/${tmdbId}`;
            }

            // We can't verify if it works without making a request, but usually it exists for TMDB items.
            // We return it as a backup embed.
            return [{
                url,
                type: "embed",
                quality: "default",
                isM3U8: false
            }];

        } catch (error) {
            console.error("VidSrc Error:", error);
            return null;
        }
    }
}

export const vidsrc = new VidSrcProvider();
