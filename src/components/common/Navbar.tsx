"use client";

import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SettingsMenu } from "./SettingsMenu";

export function Navbar() {
    return (
        <header className="fixed top-0 z-50 w-full transition-all duration-300 bg-transparent">
            {/* Gradient Mask for readability if needed, but pstream is very clean. 
                Using minimal backdrop for now. */}
            <div className="container flex h-16 items-center justify-between">
                {/* Left: Logo */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span className="text-2xl">🎭</span> P-Stream
                        </span>
                    </Link>
                </div>

                {/* Right: Icons */}
                <div className="flex items-center space-x-2">
                    {/* Social/Discord Icon could go here */}

                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600" /> {/* Notification dot */}
                    </Button>

                    <SettingsMenu />
                </div>
            </div>
        </header>
    );
}
