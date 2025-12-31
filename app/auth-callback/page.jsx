'use client';

import { useEffect, useState } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
    const { user, isLoading } = useKindeBrowserClient();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        if (!isLoading && user && !hasRedirected) {
            setHasRedirected(true);

            const returnUrl = sessionStorage.getItem('returnUrl');
            console.log("🔄 Redirecting to:", returnUrl || '/dashboard');

            if (returnUrl) {
                sessionStorage.removeItem('returnUrl');
                window.location.href = returnUrl; // Direct browser redirect
            } else {
                window.location.href = '/dashboard';
            }
        }
    }, [user, isLoading, hasRedirected]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
                <p className="text-gray-600">Please wait while we log you in</p>
            </div>
        </div>
    );
}