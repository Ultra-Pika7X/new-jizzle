"use client";

import { useSettings } from "@/hooks/useSettings";
import { ArrowLeft, Monitor, Play, Shield, Info, Moon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { settings, updateSetting, isLoaded } = useSettings();

    if (!isLoaded) return <div className="min-h-screen bg-black" />;

    return (
        <div className="min-h-screen bg-black pb-20 pt-24 text-white">
            <div className="container max-w-2xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Settings</h1>
                </div>

                {/* Account Section (Mock) */}
                <section className="space-y-4">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account</h2>
                    <div className="rounded-xl border border-white/10 bg-[#111] p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                            <div>
                                <h3 className="font-semibold text-lg">Guest User</h3>
                                <p className="text-sm text-gray-400">Sync is disabled</p>
                            </div>
                            <Button className="ml-auto bg-white/10 hover:bg-white/20 text-white">
                                Sign In
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Playback Settings */}
                <section className="space-y-4">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Playback</h2>
                    <div className="rounded-xl border border-white/10 bg-[#111] divide-y divide-white/5 overflow-hidden">

                        {/* Auto Play */}
                        <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <Play className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Auto-Play Next Episode</p>
                                    <p className="text-sm text-gray-400">Automatically play the next episode when one finishes</p>
                                </div>
                            </div>
                            <Toggle
                                checked={settings.autoPlayNext}
                                onChange={(c) => updateSetting("autoPlayNext", c)}
                            />
                        </div>

                        {/* Default Server */}
                        <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                    <Monitor className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Default Server</p>
                                    <p className="text-sm text-gray-400">Preferred streaming source</p>
                                </div>
                            </div>
                            <select
                                value={settings.defaultServer}
                                onChange={(e) => updateSetting("defaultServer", e.target.value)}
                                className="bg-black border border-white/10 rounded-md px-3 py-1 text-sm outline-none focus:border-primary"
                            >
                                <option value="vidstack">VidStack (Default)</option>
                                <option value="iframe">Legacy Iframe</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Appearance */}
                <section className="space-y-4">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appearance</h2>
                    <div className="rounded-xl border border-white/10 bg-[#111] divide-y divide-white/5 overflow-hidden">
                        <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                    <Moon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Signature Blue Glow</p>
                                    <p className="text-sm text-gray-400">Enable the ambient blue vignette effect</p>
                                </div>
                            </div>
                            <Toggle
                                checked={settings.showVignette}
                                onChange={(c) => updateSetting("showVignette", c)}
                            />
                        </div>
                    </div>
                </section>

                {/* Safety */}
                <section className="space-y-4">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Safety</h2>
                    <div className="rounded-xl border border-white/10 bg-[#111] divide-y divide-white/5 overflow-hidden">
                        <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Adult Content</p>
                                    <p className="text-sm text-gray-400">Show 18+ content in search results</p>
                                </div>
                            </div>
                            <Toggle
                                checked={settings.enableAdult}
                                onChange={(c) => updateSetting("enableAdult", c)}
                            />
                        </div>
                    </div>
                </section>

                {/* About */}
                <div className="text-center pt-8 text-gray-500 text-sm">
                    <p>P-Stream v1.0.0</p>
                    <p>Built with Next.js & VidStack</p>
                </div>
            </div>
        </div>
    );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                checked ? "bg-primary" : "bg-white/20"
            )}
        >
            <div className={cn(
                "absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform",
                checked ? "translate-x-5" : "translate-x-0"
            )} />
        </button>
    );
}
