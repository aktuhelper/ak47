import { useState, useEffect } from 'react';

export function useDeadlineCountdown(createdAt, deadlineHours) {
    const [timeLeft, setTimeLeft] = useState('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!createdAt || !deadlineHours) {
            setTimeLeft(null);
            return;
        }

        const compute = () => {
            const created = new Date(createdAt).getTime();
            const expiresAt = created + deadlineHours * 60 * 60 * 1000;
            const now = Date.now();
            const diff = expiresAt - now;

            if (diff <= 0) {
                setIsExpired(true);
                setTimeLeft('Expired');
                return;
            }

            const totalMins = Math.floor(diff / 60000);
            const hours = Math.floor(totalMins / 60);
            const mins = totalMins % 60;

            if (hours > 0) {
                setTimeLeft(`${hours}h ${mins}m left`);
            } else {
                setTimeLeft(`${mins}m left`);
            }
        };

        compute();
        const interval = setInterval(compute, 30000); // update every 30s
        return () => clearInterval(interval);
    }, [createdAt, deadlineHours]);

    return { timeLeft, isExpired };
}