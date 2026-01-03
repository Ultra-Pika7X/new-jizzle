"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { updateProfile } from "firebase/auth";
import { Camera, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [displayName, setDisplayName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            setDisplayName(user.displayName || "");
            setPhotoURL(user.photoURL || "");
        }
    }, [user, loading, router]);

    const handleUpdate = async () => {
        if (!user) return;
        try {
            await updateProfile(user, {
                displayName,
                photoURL
            });
            setMsg("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            setMsg("Failed to update profile.");
        }
    };

    if (loading || !user) return <div className="h-screen bg-black" />;

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-white">Profile</h1>

                <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 space-y-8 backdrop-blur-sm">
                    {/* Build User Info Section */}
                    <div className="flex items-start gap-8 flex-col sm:flex-row">
                        <div className="relative group mx-auto sm:mx-0">
                            <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-white/20 bg-zinc-800 flex items-center justify-center">
                                {photoURL ? (
                                    <Image src={photoURL} alt="Avatar" width={128} height={128} className="object-cover h-full w-full" />
                                ) : (
                                    <UserIcon className="h-12 w-12 text-gray-500" />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Email</label>
                                <div className="text-xl font-medium text-white">{user.email}</div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white focus:border-blue-500 outline-none"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Avatar URL</label>
                                <input
                                    type="text"
                                    value={photoURL}
                                    onChange={(e) => setPhotoURL(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white focus:border-blue-500 outline-none"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>
                        </div>
                    </div>

                    {msg && (
                        <div className={`p-3 rounded ${msg.includes("Failed") ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}`}>
                            {msg}
                        </div>
                    )}

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                        <Button onClick={handleUpdate} className="flex-1 bg-white text-black hover:bg-gray-200">
                            Save Changes
                        </Button>
                        <Button
                            onClick={() => signOut()}
                            variant="outline"
                            className="flex-1 border-red-900/50 text-red-500 hover:bg-red-950/30 hover:text-red-400"
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
