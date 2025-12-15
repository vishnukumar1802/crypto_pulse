import { useState, useEffect, useCallback, useRef } from 'react';
import { getMarkets, getCoinDetail } from '../api/coingecko';
import { useCurrency } from '../contexts/CurrencyContext';

/**
 * Hook to fetch market data (list of coins).
 * Handles loading, error, and retry logic.
 */
export const useFetchMarkets = (page = 1, perPage = 24) => {
    const { currency } = useCurrency();
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const retryTimeout = useRef(null);

    const fetchMarkets = useCallback(async (isLoadMore = false) => {
        if (!isLoadMore) setLoading(true);
        setError(null);

        try {
            const data = await getMarkets(currency, page, perPage);

            if (data.length === 0) {
                setHasMore(false);
            } else {
                setCoins(prev => isLoadMore ? [...prev, ...data] : data);
            }
        } catch (err) {
            console.error("Fetch markets failed:", err);
            // Check for Rate Limit (429)
            if (err.response?.status === 429) {
                setError("Rate limit exceeded. Retrying in 5 seconds...");
                // Simple auto-retry after delay
                clearTimeout(retryTimeout.current);
                retryTimeout.current = setTimeout(() => fetchMarkets(isLoadMore), 5000);
            } else {
                setError(err.message || "Failed to load market data.");
            }
        } finally {
            setLoading(false);
        }
    }, [currency, page, perPage]);

    useEffect(() => {
        // Reset list when currency changes
        // Note: Pagination logic is usually handled by parent calling this with changing page
        // But for this simplified hook, we might just expose a refresh.
    }, [currency]);

    // Cleanup
    useEffect(() => () => clearTimeout(retryTimeout.current), []);

    return { coins, loading, error, hasMore, fetchMarkets, setCoins };
};

/**
 * Hook to fetch single coin detail.
 */
export const useFetchCoin = (id) => {
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const retryTimeout = useRef(null);

    const fetchCoin = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);

        try {
            const data = await getCoinDetail(id);
            setCoin(data);
        } catch (err) {
            console.error(`Fetch coin ${id} failed:`, err);
            if (err.response?.status === 429) {
                setError("Updating too fast. Please wait...");
                clearTimeout(retryTimeout.current);
                retryTimeout.current = setTimeout(fetchCoin, 3000);
            } else if (err.response?.status === 404) {
                setError("Coin not found. It may have been delisted.");
            } else {
                setError("Failed to load coin data.");
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCoin();
        return () => clearTimeout(retryTimeout.current);
    }, [fetchCoin]);

    return { coin, loading, error, retry: fetchCoin, setCoin };
};
