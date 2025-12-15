import { calculateSMA, calculateRSI, calculateBollingerBands } from '../utils/indicators';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function TrendPredictor({ ohlc }) {
    // OHLC: [timestamp, open, high, low, close]
    if (!ohlc || ohlc.length < 30) return <div className="p-4 text-slate-500">Not enough data for analysis</div>;

    const closes = ohlc.map(d => d[4]);
    const currentPrice = closes[closes.length - 1];

    // 1. SMA Crossover (7 vs 25)
    const sma7 = calculateSMA(closes, 7);
    const sma25 = calculateSMA(closes, 25);
    const smaSignal = sma7 > sma25 ? 'Bullish' : 'Bearish';

    // 2. RSI
    const rsi = calculateRSI(closes);
    let rsiSignal = 'Neutral';
    if (rsi > 70) rsiSignal = 'Overbought (Sell)';
    if (rsi < 30) rsiSignal = 'Oversold (Buy)';

    // 3. Bollinger Bands
    const bb = calculateBollingerBands(closes);
    let bbSignal = 'Neutral';
    if (bb) {
        if (currentPrice > bb.upper) bbSignal = 'Upper Band Hit (Resistance)';
        if (currentPrice < bb.lower) bbSignal = 'Lower Band Hit (Support)';
    }

    // Overall Score
    let bullCount = 0;
    let bearCount = 0;
    if (smaSignal === 'Bullish') bullCount++; else bearCount++;
    if (rsi < 45) bullCount++; else if (rsi > 55) bearCount++;
    if (bb && currentPrice < bb.middle) bearCount++; else bullCount++;

    const overall = bullCount > bearCount ? 'Bullish' : bearCount > bullCount ? 'Bearish' : 'Neutral';

    return (
        <div className="card h-full">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-purple-400">⚡</span> Trend Predictor
            </h3>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-slate-400 text-sm">SMA (7 vs 25)</span>
                    <span className={smaSignal === 'Bullish' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {smaSignal}
                    </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-slate-400 text-sm">RSI (14)</span>
                    <div className="text-right">
                        <span className="font-bold block">{rsi.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">{rsiSignal}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-slate-400 text-sm">Bollinger</span>
                    <span className="text-xs text-slate-400">{bbSignal}</span>
                </div>
            </div>

            <div className={`p-4 rounded-2xl text-center border ${overall === 'Bullish' ? 'bg-emerald-500/10 border-emerald-500/30' :
                overall === 'Bearish' ? 'bg-rose-500/10 border-rose-500/30' :
                    'bg-slate-500/10 border-slate-500/30'
                }`}>
                <p className="text-sm uppercase tracking-widest opacity-70 mb-1">Overall Trend</p>
                <p className={`text-2xl font-black ${overall === 'Bullish' ? 'text-emerald-400' :
                    overall === 'Bearish' ? 'text-rose-400' :
                        'text-slate-400'
                    }`}>
                    {overall.toUpperCase()}
                </p>
            </div>
        </div>
    );
}
