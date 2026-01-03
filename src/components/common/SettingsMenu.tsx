"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, Cloud, Info, LogOut, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SettingsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <Button
                variant="ghost"
                size="icon"
                className={cn("text-white hover:bg-white/10 transition-colors", isOpen && "bg-white/10")}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-md border border-[#333] bg-[#111] p-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-400">
                        My Account
                    </div>
                    <div className="h-px bg-[#333] my-1" />

                    <button className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#222] hover:text-white text-gray-200 transition-colors">
                        <User className="mr-2 h-4 w-4 text-gray-400" />
                        <span>Profile</span>
                    </button>

                    <button className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#222] hover:text-white text-gray-200 transition-colors">
                        <Cloud className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Sync to Cloud</span>
                    </button>

                    <Link href="/settings" className="w-full">
                        <button className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#222] hover:text-white text-gray-200 transition-colors">
                            <Settings className="mr-2 h-4 w-4 text-gray-400" />
                            <span>Settings</span>
                        </button>
                    </Link>

                    <div className="h-px bg-[#333] my-1" />

                    <button className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#222] hover:text-white text-gray-200 transition-colors">
                        <Info className="mr-2 h-4 w-4 text-gray-400" />
                        <span>About P-Stream</span>
                    </button>

                    <div className="h-px bg-[#333] my-1" />

                    <button className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#222] text-red-400 hover:text-red-300 transition-colors">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </button>
                </div>
            )}
        </div>
    );
}
