import type { Stream } from "./types";
import { flixhq } from "./flixhq";
import { hianime } from "./hianime";
import { vidsrc } from "./vidsrc";

export async function getStream(
    tmdbId: string,
    episode: number = 1,
    season?: number,
    isAnime: boolean = false
): Promise<Stream | null> {
    console.log(`Getting stream for ${tmdbId}, S${season} E${episode}, Anime: ${isAnime}`);

    // 1. Try VidSrc first (User Preference)
    try {
        const vidsrcStream = await vidsrc.getStream(tmdbId, episode, season);
        if (vidsrcStream && vidsrcStream.length > 0) {
            console.log("Found stream from vidsrc");
            return { ...vidsrcStream[0], source: "vidsrc" };
        }
    } catch (e) {
        console.error("VidSrc failed:", e);
    }

    // 2. Try FlixHQ (Movies/TV)
    if (!isAnime) {
        try {
            const flix = await flixhq.getStream(tmdbId, episode, season);
            if (flix && flix.length > 0) {
                console.log("Found stream from flixhq");
                return { ...flix[0], source: "flixhq" };
            }
        } catch (e) {
            console.error("FlixHQ failed:", e);
        }
    }

    // 3. Try HiAnime (Anime)
    if (isAnime) {
        try {
            const hi = await hianime.getStream(tmdbId, episode);
            if (hi && hi.length > 0) {
                console.log("Found stream from hianime");
                return { ...hi[0], source: "hianime" };
            }
        } catch (e) {
            console.error("HiAnime failed:", e);
        }
    }

    return null;
}
