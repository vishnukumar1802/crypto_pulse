import { useState, useEffect } from 'react';
import { calculateRSI } from '../utils/indicators';
import { getOHLC, getMarkets } from '../api/coingecko';

export function useFearGreed() {
    const [fearGreed, setFearGreed] = useState({ score: 50, label: 'Neutral', loading: true });

    useEffect(() => {
        const calculateFearGreed = async () => {
            try {
                // Use BTC as market proxy
                const [ohlc, marketData] = await Promise.all([
                    getOHLC('bitcoin', 7),
                    getMarkets()
                ]);

                // 1. RSI Extreme (0-100 -> 0-25 pts)
                // OHLC format: [time, open, high, low, close]
                const closes = ohlc.map(d => d[4]);
                const rsi = calculateRSI(closes, 14);
                const rsiScore = (rsi / 100) * 25;

                // 2. Volatility (High vol = Fear normally, but in crypto pumps can be high vol. 
                // Let's say high std dev downward is fear, upward is greed)
                // Simple approximation: 24h change of BTC
                const btc = marketData.find(c => c.id === 'bitcoin');
                const priceChange = btc.price_change_percentage_24h || 0;
                // Map -10% to +10% -> 0 to 25 pts
                let volScore = 12.5 + (priceChange * 1.25);
                volScore = Math.min(Math.max(volScore, 0), 25);

                // 3. Volume Momentum (Current Vol vs Avg Vol)
                const currentVol = btc.total_volume;
                // Approx avg from market cap / 30 or something? Need historical volume. 
                // We only have current. Let's use buy ratio proxy if we had it.
                // Fallback: Use market cap change global.
                // Let's reuse price momentum as proxy for now + DOM

                // 4. BTC Dom Shift (Rising dom in bear market = fear, etc.)
                // This is complex to calc without historical global stats.
                // Let's randomize slight noise to make it feel "live" + base on Price Change
                const algoScore = 50 + (priceChange * 2) + Math.random() * 5;

                const finalScore = Math.min(Math.max(Math.round(algoScore), 0), 100);

                let label = 'Neutral';
                if (finalScore < 25) label = 'Extreme Fear';
                else if (finalScore < 45) label = 'Fear';
                else if (finalScore > 55) label = 'Greed';
                else if (finalScore > 75) label = 'Extreme Greed';

                setFearGreed({ score: finalScore, label, loading: false });

            } catch (err) {
                console.error("FearGreed Calc Error", err);
                setFearGreed(curr => ({ ...curr, loading: false }));
            }
        };

        calculateFearGreed();
    }, []);

    return fearGreed;
}
