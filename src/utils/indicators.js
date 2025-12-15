// Technical Indicators and Math Utils

// Simple Moving Average
export const calculateSMA = (data, period) => {
    if (data.length < period) return null;
    const slice = data.slice(-period);
    const sum = slice.reduce((a, b) => a + b, 0);
    return sum / period;
};

// Relative Strength Index (RSI)
export const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return 50; // Default Neutral

    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period + 1; i++) {
        const change = prices[i] - prices[i - 1];
        if (change >= 0) gains += change;
        else losses += Math.abs(change);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Smoothing (Wilder's Smoothing) not strictly implemented here, using simple avg for robustness on small datasets
    // For proper Wilder's:
    // avgGain = ((prevAvgGain * (period - 1)) + currentGain) / period

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
};

// Bollinger Bands
export const calculateBollingerBands = (prices, period = 20, multiplier = 2) => {
    if (prices.length < period) return null;
    const sma = calculateSMA(prices, period);

    const slice = prices.slice(-period);
    const squaredDiffs = slice.map(p => Math.pow(p - sma, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const stdDev = Math.sqrt(variance);

    return {
        upper: sma + (multiplier * stdDev),
        lower: sma - (multiplier * stdDev),
        middle: sma
    };
};

export const formatCurrency = (value, currency = 'USD') => {
    if (value === null || value === undefined) return '-';
    // If currency argument is actually a symbol (like '$', '€'), we might want to just prepend it manually
    // But better to expect ISO code. The calling components currently pass 'symbol' in some places, 
    // we should correct them to pass 'currency' code.
    // However, to be safe if a symbol is passed that isn't a valid code, we might fallback or try to handle.
    // For now, let's assume valid ISO code or handle simple symbol fallback if possible, 
    // but Intl requires code.

    // Check if currency is likely a code (3 chars)
    const isCode = currency && currency.length >= 3;

    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: isCode ? currency.toUpperCase() : 'USD',
            minimumFractionDigits: value < 1 ? 4 : 2,
            maximumFractionDigits: value < 1 ? 6 : 2
        }).format(value);
    } catch (e) {
        // Fallback for invalid currency code
        return `${currency} ${value?.toLocaleString()}`;
    }
};

export const formatCompactNumber = (number, currency = 'USD') => {
    if (!number) return '0';
    try {
        return Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.length >= 3 ? currency.toUpperCase() : 'USD',
            notation: "compact",
            maximumFractionDigits: 1
        }).format(number);
    } catch (e) {
        return number.toLocaleString();
    }
};
