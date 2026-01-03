import { jikan } from "@/lib/jikan";

const ANISKIP_API = "https://api.aniskip.com/v2/skip-times";

export interface SkipTime {
    start: number;
    end: number;
    type: "op" | "ed" | "mixed-op" | "mixed-ed" | "recap";
}

export interface SkipTimes {
    op?: SkipTime;
    ed?: SkipTime;
}

export async function getMalId(title: string): Promise<number | null> {
    const search = await jikan.searchAnime(title);
    if (search && search.results && search.results.length > 0) {
        return search.results[0].id;
    }
    return null;
}

export async function getSkipTimes(malId: number, episode: number): Promise<SkipTimes | null> {
    try {
        // Types: op (Opening), ed (Ending)
        const url = `${ANISKIP_API}/${malId}/${episode}?types[]=op&types[]=ed&episodeLength=0`;
        const res = await fetch(url);

        if (!res.ok) {
            return null;
        }

        const data = await res.json();

        if (data.found) {
            const result: SkipTimes = {};

            const op = data.results.find((r: { skipType: string, interval: { startTime: number, endTime: number } }) => r.skipType === "op");
            if (op) {
                result.op = {
                    start: op.interval.startTime,
                    end: op.interval.endTime,
                    type: "op"
                };
            }

            const ed = data.results.find((r: { skipType: string, interval: { startTime: number, endTime: number } }) => r.skipType === "ed");
            if (ed) {
                result.ed = {
                    start: ed.interval.startTime,
                    end: ed.interval.endTime,
                    type: "ed"
                };
            }

            return Object.keys(result).length > 0 ? result : null;
        }
        return null;
    } catch (e) {
        console.error("AniSkip error:", e);
        return null;
    }
}
