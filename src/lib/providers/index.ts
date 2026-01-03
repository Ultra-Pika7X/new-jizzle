import type { Stream } from "./types";
import { flixhq } from "./flixhq";
import { hianime } from "./hianime";
import { vidsrc } from "./vidsrc";

export async function getStream(tmdbId: string, episode?: number, season?: number, isAnime: boolean = false): Promise<Stream | null> {

    const providers = [];

    // Priority Logic
    if (isAnime) {
        providers.push(hianime);
        providers.push(flixhq); // Backup
    } else {
        providers.push(flixhq);
    }

    // VidSrc is always absolute backup as embed
    providers.push(vidsrc);

    for (const provider of providers) {
        console.log(`Checking provider: ${provider.name}...`);
        try {
            const streams = await provider.getStream(tmdbId, episode, season);
            if (streams && streams.length > 0) {
                // Return first valid stream
                // Prefer 'file' type if possible (implicit in order: FlixHQ returns file, VidSrc returns embed)
                console.log(`Found stream from ${provider.name}`);
                return streams[0];
            }
        } catch (e) {
            console.error(`Provider ${provider.name} failed:`, e);
        }
    }

    return null;
}
