import { useState, useEffect } from "react";
import { fetchFromStrapi } from '@/secure/strapi';

export function useUsernameValidation(username) {
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [checkingUsername, setCheckingUsername] = useState(false);

    useEffect(() => {
        if (!username || username.length < 3) {
            setUsernameAvailable(null);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setCheckingUsername(true);
            try {
                // ✅ Use secure fetchFromStrapi
                const data = await fetchFromStrapi(
                    `user-profiles?filters[username][$eq]=${encodeURIComponent(username)}`
                );

                if (data.data && data.data.length > 0) {
                    setUsernameAvailable(false);
                } else {
                    setUsernameAvailable(true);
                }
            } catch (err) {
                console.error("❌ Error checking username:", err);
                setUsernameAvailable(null);
            } finally {
                setCheckingUsername(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [username]);

    return { usernameAvailable, checkingUsername };
}

export function useExistingUserCheck(userEmail) {
    const [checkingUser, setCheckingUser] = useState(true);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);

    useEffect(() => {
        const checkExistingUser = async () => {
            if (!userEmail) {
                setCheckingUser(false);
                return;
            }

            try {
              

                // ✅ Use secure fetchFromStrapi
                const data = await fetchFromStrapi(
                    `user-profiles?filters[email][$eq]=${encodeURIComponent(userEmail)}`
                );

                

                if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
                    
                    setAlreadyRegistered(true);
                } else {
        
                    setAlreadyRegistered(false);
                }
            } catch (err) {
                console.error("❌ Error checking existing user:", err);
                setAlreadyRegistered(false);
            } finally {
                setCheckingUser(false);
            }
        };

        checkExistingUser();
    }, [userEmail]);

    return { checkingUser, alreadyRegistered };
}