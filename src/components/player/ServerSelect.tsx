"use client";

import { Monitor, Server } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ServerSelectProps {
    currentServer: string;
    onServerChange: (server: string) => void;
}

export function ServerSelect({ currentServer, onServerChange }: ServerSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const servers = [
        { id: "vidsrc", name: "VidSrc (Best)", icon: Monitor },
        { id: "vidstack", name: "VidStack", icon: Server },
        { id: "embed", name: "Embed", icon: Server },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md transition-colors border border-white/5"
            >
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-white">
                    {servers.find(s => s.id === currentServer)?.name || "Server"}
                </span>
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 w-48 bg-black/90 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md z-[70] animate-in fade-in zoom-in-95">
                    <div className="p-2 space-y-1">
                        {servers.map((server) => {
                            const Icon = server.icon;
                            return (
                                <button
                                    key={server.id}
                                    onClick={() => {
                                        onServerChange(server.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                                        currentServer === server.id
                                            ? "bg-white/10 text-white font-medium"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {server.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
