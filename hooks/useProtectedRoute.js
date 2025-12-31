"use client";
import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { fetchFromStrapi } from '@/secure/strapi';

export const useProtectedRoute = () => {
    const { user, isLoading } = useKindeBrowserClient();
    const router = useRouter();
    const [isRegistered, setIsRegistered] = useState(null);
    const [checkingRegistration, setCheckingRegistration] = useState(true);

    useEffect(() => {
        const checkUserRegistration = async () => {
            // If still loading Kinde auth, wait
            if (isLoading) return;

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
              

                // ✅ Use fetchFromStrapi instead of direct fetch
                const data = await fetchFromStrapi(
                    `user-profiles?filters[email][$eq]=${encodeURIComponent(email)}`
                );

                if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
           
                    setIsRegistered(true);
                } else {
                  
                    setIsRegistered(false);
                    // Store redirect intent
                    sessionStorage.setItem("openMeetSeniorModal", "true");
                    router.push("/campusconnect");
                }
            } catch (error) {
                
                router.push("/campusconnect");
            } finally {
                setCheckingRegistration(false);
            }
        };

        checkUserRegistration();
    }, [user, isLoading, router]);

    return { isRegistered, checkingRegistration, user };
};