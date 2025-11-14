'use client';

import { useEffect } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
    const { user, isLoading } = useKindeBrowserClient();
    const router = useRouter();

    useEffect(() => {
        // Wait for authentication to complete
        if (!isLoading && user) {
            // Check if there's a return URL stored
            const returnUrl = sessionStorage.getItem('returnUrl');

            if (returnUrl) {
                console.log('🔄 Redirecting to:', returnUrl);
                // Clear the return URL
                sessionStorage.removeItem('returnUrl');
                // Redirect to the stored URL
                router.push(returnUrl);
            } else {
                // Default redirect if no return URL
                console.log('🏠 No return URL, redirecting to dashboard');
                router.push('/'); // or your default page
            }
        }
    }, [user, isLoading, router]);

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