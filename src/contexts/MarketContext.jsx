import { createContext, useContext, useEffect, useState } from 'react';
import { getMarkets, getGlobalStats } from '../api/coingecko';
import { useCurrency } from './CurrencyContext';

const MarketContext = createContext();

export function MarketProvider({ children }) {
    const { currency } = useCurrency();
    const [coins, setCoins] = useState([]);
    const [globalStats, setGlobalStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const refreshData = async () => {
        setPage(1);
        try {
            // Validate API parameters before call
            if (!currency) console.warn("Currency is missing in refreshData");

            const [coinsData, globalData] = await Promise.all([
                getMarkets(currency, 1, 24),
                getGlobalStats()
            ]);

            // Validate response data
            if (!Array.isArray(coinsData)) {
                throw new Error("Invalid markets data format");
            }

            setCoins(coinsData);
            setGlobalStats(globalData);
            setHasMore(true);
            setError(null);
        } catch (err) {
            // Detailed Error Logging
            if (err.response) {
                console.error(`API Error ${err.response.status}: ${err.response.data?.error || err.message}`);
                console.error("URL:", err.config?.url);

                if (err.response.status === 429) {
                    setError("Too many requests. Slowing down updates (Rate Limited).");
                } else if (err.response.status === 404) {
                    setError("API endpoint not found (404).");
                } else {
                    setError(`Failed to fetch data: ${err.message}`);
                }
            } else if (err.request) {
                console.error("Network Error - No response received", err.request);
                setError("Network error. Please check your internet connection.");
            } else {
                console.error("Error setting up request:", err.message);
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };


    const loadMore = async () => {
        if (!hasMore) return;
        try {
            const nextPage = page + 1;
            const newCoins = await getMarkets(currency, nextPage, 24);
            if (newCoins.length === 0) setHasMore(false);
            else {
                setCoins(prev => [...prev, ...newCoins]);
                setPage(nextPage);
            }
        } catch (err) {
            console.error("Failed to load more coins", err);
        }
    };

    useEffect(() => {
        setLoading(true);
        refreshData();
        // Auto refresh logic slightly adjusted for infinite scroll: 
        // Only refresh the first page every 60s might look weird if user scrolled down.
        // For simplicity in this demo, strict auto-refresh might reset the list or be disabled.
        // Let's keep manual refresh or simple interval that just updates current viewed coins if complicated.
        // For now, simple refresh of Page 1.
    }, [currency]);

    return (
        <MarketContext.Provider value={{ coins, globalStats, loading, error, refreshData, loadMore, hasMore }}>
            {children}
        </MarketContext.Provider>
    );
}

export function useMarket() {
    return useContext(MarketContext);
}
