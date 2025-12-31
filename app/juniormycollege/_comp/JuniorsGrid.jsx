import React from 'react';
import SeniorCard from '@/app/_loggedinHome/_homepage/SeniorCard';

export default function JuniorsGrid({
    juniors,
    currentUserId,
    onlineUsers,
    isSeniorPage = false
}) {
    if (!juniors || juniors.length === 0) return null;

    // Optional: Debug log to see online users
    console.log(`🔍 ${isSeniorPage ? 'Seniors' : 'Juniors'}Grid - Online users:`, onlineUsers?.length || 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {juniors.map((junior) => {
                // Check if this user is currently online
                const isLive = onlineUsers?.includes(junior.id);

                return (
                    <SeniorCard
                        key={junior?.documentId || junior.id}
                        senior={junior}
                        currentUserId={currentUserId}
                        isLive={isLive}
                    />
                );
            })}
        </div>
    );
}