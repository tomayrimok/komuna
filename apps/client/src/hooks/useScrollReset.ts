import { useEffect, useRef } from 'react';
import { useLocation } from '@tanstack/react-router';

export const useScrollReset = () => {
    const location = useLocation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0 });
        }
    }, [location.pathname]);

    return scrollContainerRef;
}; 