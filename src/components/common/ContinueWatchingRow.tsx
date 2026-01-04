"use client";

import { useWatchHistory } from "@/hooks/useWatchHistory";
import { MediaRow } from "@/components/common/MediaRow";

export function ContinueWatchingRow() {
    const { history, isLoaded } = useWatchHistory();

    // Don't render until data is loaded and there's history
    if (!isLoaded || history.length === 0) return null;

    return (
        <MediaRow
            title="Continue Watching"
            items={history}
        />
    );
}

