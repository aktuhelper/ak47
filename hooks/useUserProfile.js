import { useState, useEffect } from "react";

const STRAPI_URL = "http://localhost:1337";

export default function useUserProfile(email) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!email) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `${STRAPI_URL}/api/user-profiles?filters[email][$eq]=${encodeURIComponent(email)}&populate=*`
                );

                const data = await res.json();
                setProfile(data?.data?.[0] || null);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [email]);

    return { profile, loading };
}
