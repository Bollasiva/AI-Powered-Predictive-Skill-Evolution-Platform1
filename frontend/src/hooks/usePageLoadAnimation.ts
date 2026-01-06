import { useEffect, useState } from 'react';

/**
 * Hook to orchestrate staggered page load animations
 * Returns boolean flags for each animation phase
 */
export const usePageLoadAnimation = () => {
    const [phases, setPhases] = useState({
        background: false,
        sidebar: false,
        header: false,
        cards: false,
    });

    useEffect(() => {
        // Background fades in immediately
        setPhases(prev => ({ ...prev, background: true }));

        // Sidebar slides in after 100ms
        const sidebarTimer = setTimeout(() => {
            setPhases(prev => ({ ...prev, sidebar: true }));
        }, 100);

        // Header slides down after 200ms
        const headerTimer = setTimeout(() => {
            setPhases(prev => ({ ...prev, header: true }));
        }, 200);

        // Cards stagger in after 300ms
        const cardsTimer = setTimeout(() => {
            setPhases(prev => ({ ...prev, cards: true }));
        }, 300);

        return () => {
            clearTimeout(sidebarTimer);
            clearTimeout(headerTimer);
            clearTimeout(cardsTimer);
        };
    }, []);

    return phases;
};
