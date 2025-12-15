import { TrendingUp, TrendingDown, Activity, Zap, HelpCircle } from 'lucide-react';
import { useMarket } from '../contexts/MarketContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useFearGreed } from '../hooks/useFearGreed';
import { formatCompactNumber } from '../utils/indicators';
import MetricTooltip from './common/MetricTooltip';
import { GLOSSARY } from '../data/learnData';

export default function GlobalStats() {
    const { globalStats, loading } = useMarket();
    const { currency, symbol } = useCurrency();
    const { score, label } = useFearGreed();

    if (loading || !globalStats) return (
        <div className="h-24 w-full bg-slate-900/50 animate-pulse rounded-2xl mb-8 border border-white/5" />
    );

    const { total_market_cap, total_volume, market_cap_percentage } = globalStats;
    const totalCap = total_market_cap?.[currency] || total_market_cap?.usd || 0;
    const volume = total_volume?.[currency] || total_volume?.usd || 0;
    const btcDom = market_cap_percentage?.btc || 0;

    // CoinGecko global endpoint usually returns market_cap_change_percentage_24h_usd
    // We'll use specific currency change if available or fallback to USD change
    const capChange = globalStats.market_cap_change_percentage_24h_usd || 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card !p-4 flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                    <Activity size={20} />
                </div>
                <div>
                    <MetricTooltip termKey="market_cap" data={GLOSSARY}>
                        <p className="text-xs text-slate-400 border-b border-dashed border-slate-500/50 hover:border-cyan-400 cursor-help transition-colors">Global Market Cap</p>
                    </MetricTooltip>
                    <p className="font-bold text-lg">{symbol}{formatCompactNumber(totalCap)}</p>
                    <span className={capChange >= 0 ? "text-emerald-400 text-xs" : "text-rose-400 text-xs"}>
                        {capChange.toFixed(2)}%
                    </span>
                </div>
            </div>

            <div className="card !p-4 flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <MetricTooltip termKey="volume_24h" data={GLOSSARY}>
                        <p className="text-xs text-slate-400 border-b border-dashed border-slate-500/50 hover:border-cyan-400 cursor-help transition-colors">24h Volume</p>
                    </MetricTooltip>
                    <p className="font-bold text-lg">{symbol}{formatCompactNumber(volume)}</p>
                </div>
            </div>

            <div className="card !p-4 flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                    <Zap size={20} />
                </div>
                <div>
                    <MetricTooltip termKey="dominance" data={GLOSSARY}>
                        <p className="text-xs text-slate-400 border-b border-dashed border-slate-500/50 hover:border-cyan-400 cursor-help transition-colors">BTC Dominance</p>
                    </MetricTooltip>
                    <p className="font-bold text-lg">{btcDom.toFixed(1)}%</p>
                </div>
            </div>

            <div className="card !p-4 flex items-center gap-3 relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-current to-transparent opacity-20"
                    style={{ color: score > 50 ? '#10b981' : '#f43f5e' }} />

                <div className="p-3 rounded-xl" style={{ backgroundColor: score > 50 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', color: score > 50 ? '#10b981' : '#f43f5e' }}>
                    {score > 50 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                    <p className="text-xs text-slate-400">Fear & Greed</p>
                    <p className="font-bold text-lg">{score}/100</p>
                    <p className="text-xs opacity-80">{label}</p>
                </div>
            </div>
        </div>
    );
}
