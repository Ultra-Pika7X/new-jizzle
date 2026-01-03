"use client";

import { AuthProvider } from "@/context/AuthContext";

import { VignetteEffect } from "./VignetteEffect";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <VignetteEffect />
            {children}
        </AuthProvider>
    );
}
