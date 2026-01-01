"use client";

import { useWatchHistory } from "@/hooks/useWatchHistory";
import { MediaRow } from "@/components/common/MediaRow";
import { useEffect, useState } from "react";

export function ContinueWatchingRow() {
    const { history } = useWatchHistory();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || history.length === 0) return null;

    return (
        <MediaRow
            title="Continue Watching"
            items={history}
        />
    );
}
