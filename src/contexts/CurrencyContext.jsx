import { createContext, useContext, useEffect, useState } from 'react';
import { getSupportedCurrencies } from '../api/coingecko';

const CurrencyContext = createContext();

const SYMBOLS = {
    usd: '$',
    eur: '€',
    inr: '₹',
    jpy: '¥',
    gbp: '£',
    cad: 'C$',
    aud: 'A$',
    cny: '¥',
    rub: '₽',
    krw: '₩',
    try: '₺',
    brl: 'R$',
    zar: 'R',
    chf: 'Fr',
    // Add more as needed or fallback to code
};

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState('usd');
    const [supportedCurrencies, setSupportedCurrencies] = useState(['usd']);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const data = await getSupportedCurrencies();
                setSupportedCurrencies(data.sort());
            } catch (err) {
                console.error("Failed to load currencies", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrencies();
    }, []);

    const symbol = SYMBOLS[currency] || currency.toUpperCase();

    const formatPrice = (price) => {
        if (price === null || price === undefined) return '-';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
            maximumSignificantDigits: 6
        }).format(price);
    };

    const value = {
        currency,
        setCurrency,
        symbol,
        supportedCurrencies,
        formatPrice,
        loading
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}
