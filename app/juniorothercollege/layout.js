"use client";
import ProtectedRoute from '@/app/contexts/ProtectedRoute';

export default function JuniorsOtherCollegesLayout({ children }) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}

