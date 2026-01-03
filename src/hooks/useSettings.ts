import { useState, useEffect } from 'react';

interface AppSettings {
    autoPlayNext: boolean;
    defaultServer: string;
    showVignette: boolean;
    enableAdult: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
    autoPlayNext: true,
    defaultServer: 'vidstack',
    showVignette: true,
    enableAdult: false,
};

const STORAGE_KEY = 'pstream_settings';

export function useSettings() {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                // Merge with defaults to handle new keys
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    };

    return {
        settings,
        updateSetting,
        isLoaded
    };
}
