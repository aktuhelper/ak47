"use client";
import ProtectedRoute from '@/app/contexts/ProtectedRoute';

export default function SeniorsFromOtherCollegesLayout({ children }) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}