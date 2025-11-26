"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function RequireAuth({ children }) {
    const { user, isLoading } = useKindeBrowserClient();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            // Save the current page the user tried to access
            sessionStorage.setItem("returnUrl", window.location.pathname);

            router.push("/api/auth/login"); // Kinde login redirect
        }
    }, [user, isLoading, router]);

    // Show loader while checking auth
    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
        );
    }

    return <>{children}</>;
}
