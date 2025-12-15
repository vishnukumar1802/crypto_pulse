import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

// Simple cache structure
const cache = {
    markets: { data: null, timestamp: 0 },
    global: { data: null, timestamp: 0 },
    coinDetails: {}, // { bitcoin: { data: ..., timestamp: ... } }
    ohlc: {}
};

const CACHE_DURATION = 60 * 1000; // 1 minute cache for free tier safety

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

export const getGlobalStats = async () => {
    const now = Date.now();
    if (cache.global.data && now - cache.global.timestamp < CACHE_DURATION) {
        return cache.global.data;
    }

    try {
        const response = await api.get('/global');
        cache.global = { data: response.data.data, timestamp: now };
        return response.data.data;
    } catch (error) {
        console.error("Global stats error:", error);
        return cache.global.data; // Return stale data if fail
    }
};

const MARKET_CACHE_DURATION = 30 * 1000; // 30 seconds for list

export const getMarkets = async (vsCurrency = 'usd', page = 1, perPage = 250) => {
    const cacheKey = `markets-${vsCurrency}-${page}-${perPage}`;
    const now = Date.now();

    // Check specific page cache
    if (cache.markets[cacheKey] && now - cache.markets[cacheKey].timestamp < MARKET_CACHE_DURATION) {
        return cache.markets[cacheKey].data;
    }

    try {
        const response = await api.get('/coins/markets', {
            params: {
                vs_currency: vsCurrency,
                order: 'market_cap_desc',
                per_page: perPage,
                page: page,
                sparkline: true,
                price_change_percentage: '1h,24h,7d'
            }
        });

        // Cache this page
        if (!cache.markets) cache.markets = {}; // Ensure object exists if we change structure
        cache.markets[cacheKey] = { data: response.data, timestamp: now };

        return response.data;
    } catch (error) {
        console.error("Markets error:", error);
        throw error;
    }
};

export const getCoinDetail = async (id) => {
    const now = Date.now();
    if (cache.coinDetails[id] && now - cache.coinDetails[id].timestamp < CACHE_DURATION) {
        return cache.coinDetails[id].data;
    }

    try {
        const response = await api.get(`/coins/${id}`, {
            params: {
                localization: false,
                tickers: true,
                market_data: true,
                community_data: true, // Needed for Analytics
                developer_data: true, // Needed for Analytics
                sparkline: true
            }
        });
        cache.coinDetails[id] = { data: response.data, timestamp: now };
        return response.data;
    } catch (error) {
        console.error(`Coin detail error (${id}):`, error);
        throw error;
    }
};

export const getOHLC = async (id, days = 1, vsCurrency = 'usd') => {
    // CoinGecko OHLC: days=1/7/14/30/90/180/365/max
    const cacheKey = `${id}-${days}-${vsCurrency}`;
    const now = Date.now();

    if (cache.ohlc[cacheKey] && now - cache.ohlc[cacheKey].timestamp < CACHE_DURATION) {
        return cache.ohlc[cacheKey].data;
    }

    try {
        const response = await api.get(`/coins/${id}/ohlc`, {
            params: {
                vs_currency: vsCurrency,
                days: days
            }
        });
        cache.ohlc[cacheKey] = { data: response.data, timestamp: now };
        return response.data;
    } catch (error) {
        console.error(`OHLC error (${id}):`, error);
        throw error;
    }
};

export const getSupportedCurrencies = async () => {
    try {
        const response = await api.get('/simple/supported_vs_currencies');
        return response.data;
    } catch (error) {
        console.error("Supported currencies error:", error);
        return ['usd', 'eur', 'inr', 'gbp', 'jpy']; // Fallback
    }
};

export const getSimplePrice = async (ids, vs_currencies) => {
    try {
        const response = await api.get('/simple/price', {
            params: {
                ids: ids,
                vs_currencies: vs_currencies
            }
        });
        return response.data;
    } catch (error) {
        console.error("Simple price error:", error);
        throw error;
    }
};
