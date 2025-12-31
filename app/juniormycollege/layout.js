"use client";
import ProtectedRoute from '@/app/contexts/ProtectedRoute';

export default function JuniorMyCollegeLayout({ children }) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}