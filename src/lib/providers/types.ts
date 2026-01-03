export interface Stream {
    url: string;
    type: "file" | "embed"; // 'file' for m3u8/mp4, 'embed' for iframe
    quality?: "default" | "360p" | "480p" | "720p" | "1080p";
    isM3U8: boolean;
    subtitles?: Subtitle[];
    headers?: Record<string, string>;
    source?: string;
}

export interface Subtitle {
    url: string;
    lang: string;
    label: string;
}

export interface Provider {
    name: string;
    getStream(id: string, episode?: number, season?: number): Promise<Stream[] | null>;
}
