"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { fetchFromStrapi } from '@/secure/strapi'; // ✅ Import secure wrapper

export default function ProtectedRoute({ children }) {
    const { user, isLoading: kindeLoading } = useKindeBrowserClient();
    const router = useRouter();

    const [isRegistered, setIsRegistered] = useState(null);
    const [checkingRegistration, setCheckingRegistration] = useState(true);

    useEffect(() => {
        const checkUserRegistration = async () => {
            // If still loading Kinde auth, wait
            if (kindeLoading) {
               
                return;
            }

            // If not logged in, redirect to home
            if (!user) {
               
                router.push("/campusconnect");
                return;
            }

            // Get user email
            const email = user.email || user.given_name || user.id;

            if (!email) {
          
                router.push("/campusconnect");
                return;
            }

            try {
              

                // ✅ Use secure wrapper instead of direct fetch
                const result = await fetchFromStrapi(
                    `user-profiles?filters[email][$eq]=${encodeURIComponent(email)}&populate=*`
                );

                // ✅ Check if user exists in Strapi
                if (result?.data && Array.isArray(result.data) && result.data.length > 0) {
                    const userRecord = result.data[0];
                    const userData = userRecord.attributes || userRecord;

                    // Check if user has completed required registration fields
                    const hasCompletedRegistration = Boolean(
                        userData.course &&
                        userData.year &&
                        userData.college &&
                        userData.name
                    );

                    if (hasCompletedRegistration) {
                       
                        setIsRegistered(true);
                    } else {
                        
                        setIsRegistered(false);
                        router.push("/campusconnect");
                    }
                } else {
                    
                    setIsRegistered(false);
                    // Store redirect intent if needed
                    sessionStorage.setItem("openMeetSeniorModal", "true");
                    router.push("/campusconnect");
                }
            } catch (error) {
              
                setIsRegistered(false);
                router.push("/campusconnect");
            } finally {
                setCheckingRegistration(false);
            }
        };

        checkUserRegistration();
    }, [user, kindeLoading, router]);

    // Combined loading state
    const isLoading = kindeLoading || checkingRegistration;

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-theme-primary">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        {kindeLoading ? 'Checking authentication...' : 'Verifying registration...'}
                    </p>
                </div>
            </div>
        );
    }

    // Don't render children if not registered
    if (isRegistered === false || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-theme-primary">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting...</p>
                </div>
            </div>
        );
    }

    // User is authenticated and registered - render children
    return <>{children}</>;
}