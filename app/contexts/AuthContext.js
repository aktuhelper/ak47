"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';

// Create Auth Context
const AuthContext = createContext(undefined);
const STRAPI_URL = "http://localhost:1337"

// Auth Provider Component
export function AuthProvider({ children }) {
    // Kinde Auth hooks
    const { isAuthenticated, isLoading: kindeLoading, user: kindeUser, getToken } = useKindeAuth();

    // Local state
    const [strapiUser, setStrapiUser] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
    const [registrationError, setRegistrationError] = useState(null);

    // Check registration status in Strapi when Kinde user is authenticated
    useEffect(() => {
        if (isAuthenticated && kindeUser?.email) {
            checkStrapiRegistration();
        } else {
            setIsCheckingRegistration(false);
            setStrapiUser(null);
            setIsRegistered(false);
        }
    }, [isAuthenticated, kindeUser?.email]); // Only depend on email, not full user object


    const checkStrapiRegistration = async () => {
        try {
            setIsCheckingRegistration(true);
            setRegistrationError(null);

            const response = await fetch(
                `${STRAPI_URL}/api/user-profiles?filters[email][$eq]=${encodeURIComponent(kindeUser.email)}&populate=*`
            );

            if (response.ok) {
                const result = await response.json();

                // ✅ FIX: Strapi returns {data: [...], meta: {...}}
                if (result.data && result.data.length > 0) {
                    const userRecord = result.data[0];
                    const userData = userRecord.attributes || userRecord;

                    // Check if user has completed required registration fields
                    const hasCompletedRegistration = Boolean(
                        userData.course &&
                        userData.year &&
                        userData.college &&
                        userData.name
                    );

                    console.log('✅ User found in Strapi:', {
                        email: kindeUser.email,
                        hasCompletedRegistration,
                        userData
                    });

                    setStrapiUser({
                        id: userRecord.id,
                        ...userData
                    });
                    setIsRegistered(hasCompletedRegistration);
                } else {
                    // User not found in Strapi - needs registration
                    console.log('⚠️ User not found in Strapi:', kindeUser.email);
                    setStrapiUser(null);
                    setIsRegistered(false);
                }
            } else {
                console.error('Failed to fetch user from Strapi:', response.status);
                setRegistrationError('Failed to verify registration status');
                setIsRegistered(false);
            }
        } catch (error) {
            console.error('Strapi registration check error:', error);
            setRegistrationError('Network error while checking registration');
            setIsRegistered(false);
        } finally {
            setIsCheckingRegistration(false);
        }
    };

    // Function to refresh registration status
    const refreshRegistrationStatus = async () => {
        await checkStrapiRegistration();
    };

    // Combined loading state
    const isLoading = kindeLoading || isCheckingRegistration;

    // Check if user can access protected routes
    const canAccessProtectedRoute = isAuthenticated && isRegistered;

    const value = {
        // Kinde user data
        kindeUser,
        isAuthenticated,

        // Strapi user data
        strapiUser,
        isRegistered,

        // Loading states
        isLoading,
        kindeLoading,
        isCheckingRegistration,

        // Error state
        registrationError,

        // Access control
        canAccessProtectedRoute,

        // Functions
        refreshRegistrationStatus,
        checkStrapiRegistration,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}