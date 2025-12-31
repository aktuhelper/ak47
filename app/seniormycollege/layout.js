"use client";
import ProtectedRoute from '@/app/contexts/ProtectedRoute';

export default function SeniorMyCollegeLayout({ children }) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}