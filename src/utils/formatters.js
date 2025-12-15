export const formatPrice = (price, currency = 'USD') => {
    if (price === null || price === undefined) return '—';

    // Check if currency is a code
    const currencyCode = currency.length >= 3 ? currency.toUpperCase() : 'USD';

    try {
        // For very small numbers (like some crypto), show more decimals
        if (price < 0.01 && price > 0) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 6,
                maximumFractionDigits: 6,
            }).format(price);
        }

        // For large numbers (> 1M), or just generally compact for the card
        if (price >= 1000000) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
                notation: 'compact',
                maximumFractionDigits: 2,
            }).format(price);
        }

        // Standard formatting
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);

    } catch (error) {
        console.error("Formatting error:", error);
        return `${currency} ${price}`;
    }
};

export const formatChange = (change) => {
    if (change === null || change === undefined) return '—';
    return `${Math.abs(change).toFixed(2)}%`;
};

export const formatCompactNumber = (number) => {
    if (number === null || number === undefined) return '—';
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(number);
};
