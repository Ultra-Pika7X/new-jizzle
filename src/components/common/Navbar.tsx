"use client";

import Link from "next/link";
import { User, Cloud, Library, History } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SettingsMenu } from "./SettingsMenu";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export function Navbar() {
    const { user, loading } = useAuth();

    return (
        <header className="fixed top-0 z-50 w-full transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent">
            <div className="container flex h-16 items-center justify-between">
                {/* Left: Logo (Minimal) */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🎭</span>
                    </Link>
                </div>

                {/* Right: Icons - Order: Library, Profile/Cloud, Settings, History */}
                <div className="flex items-center space-x-1">
                    {/* Library Icon */}
                    <Link href="/list">
                        <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white" title="My Library">
                            <Library className="h-5 w-5" />
                        </Button>
                    </Link>

                    {/* Profile / Cloud Sync Icon */}
                    {!loading && (
                        user ? (
                            <Link href="/profile">
                                <div className="h-9 w-9 rounded-full overflow-hidden border border-white/10 hover:border-white/50 transition-colors">
                                    {user.photoURL ? (
                                        <Image src={user.photoURL} alt="Profile" width={36} height={36} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white" title="Cloud Sync / Login">
                                    <Cloud className="h-5 w-5" />
                                </Button>
                            </Link>
                        )
                    )}

                    {/* Settings Menu */}
                    <SettingsMenu />

                    {/* History Icon */}
                    <Link href="/history">
                        <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white" title="Watch History">
                            <History className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

