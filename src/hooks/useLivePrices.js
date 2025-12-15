import { useState, useEffect, useRef } from 'react';
import { getSimplePrice } from '../api/coingecko';
import { useCurrency } from '../contexts/CurrencyContext';

// Cache to prevent component re-mounts from triggering immediate refetches if not needed
const livePriceCache = {
    data: null,
    timestamp: 0,
    ids: []
};

/**
 * Hook to fetch live prices for specific coin IDs
 * @param {string[]} coinIds - Array of coin IDs to fetch (e.g., ['bitcoin', 'ethereum'])
 * @param {number} intervalMs - Polling interval in milliseconds
 * @returns {object} { prices, lastUpdate, isLive, fpsLoading }
 */
export const useLivePrices = (coinIds, intervalMs = 5000) => {
    const { currency } = useCurrency();
    const [prices, setPrices] = useState({});
    const [lastUpdate, setLastUpdate] = useState('');
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef(null);

    // Create a string key for dependencies to avoid deep comparison issues
    const idsKey = coinIds.sort().join(',');

    useEffect(() => {
        if (!coinIds || coinIds.length === 0) return;

        const fetchLivePrices = async () => {
            // Optimistically use cache if valid and matching request
            const now = Date.now();
            if (livePriceCache.data &&
                livePriceCache.ids === idsKey &&
                (now - livePriceCache.timestamp < 1000)) { // 1s cache validity for "live" feel
                setPrices(livePriceCache.data);
                // Don't return early, we still want to fetch fresh data, this just prevents flicker
            }

            try {
                // Passing currency to getSimplePrice ensures we get the right value
                const data = await getSimplePrice(idsKey, currency);

                setPrices(prev => {
                    // Only update state if values actually changed to prevent unnecessary re-renders
                    if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
                    return data;
                });

                setLastUpdate(new Date().toLocaleTimeString());
                setLoading(false);

                // Update cache
                livePriceCache.data = data;
                livePriceCache.timestamp = Date.now();
                livePriceCache.ids = idsKey;
            } catch (error) {
                console.warn('Price update skipped:', error);
                // Don't set loading true on error, keep old data
            }
        };

        fetchLivePrices(); // Load immediately

        intervalRef.current = setInterval(fetchLivePrices, intervalMs);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [idsKey, intervalMs, currency]);

    return { prices, lastUpdate, loading, isLive: true };
};
