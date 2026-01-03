"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900/50 rounded-xl border border-white/10 backdrop-blur-sm">
                <h1 className="text-3xl font-bold text-center">Create Account</h1>
                <p className="text-center text-gray-400">Join Jizzle to track your shows across devices</p>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-black/50 border border-white/10 focus:border-blue-500 outline-none transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-black/50 border border-white/10 focus:border-blue-500 outline-none transition-colors"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
                        Sign Up
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
