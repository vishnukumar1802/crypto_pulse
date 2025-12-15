import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import { ArrowUp, ArrowDown, Star, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { formatPrice, formatChange, formatCompactNumber } from '../utils/formatters';
import { useCurrency } from '../contexts/CurrencyContext';
import { useEffect, useRef, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function CoinCard({ coin, index = 0, livePriceData, isLoading = false, error = null }) {
    const { toggleWatchlist, isInWatchlist, addToPortfolio } = usePortfolio();
    const navigate = useNavigate();
    const { currency } = useCurrency();

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="glass-card h-full w-full flex flex-col justify-between p-4 md:p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-700/50" />
                        <div>
                            <div className="h-4 w-24 bg-slate-700/50 rounded mb-2" />
                            <div className="h-3 w-12 bg-slate-700/50 rounded" />
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="h-6 w-20 bg-slate-700/50 rounded" />
                        <div className="h-4 w-12 bg-slate-700/50 rounded" />
                    </div>
                </div>
                <div className="h-16 w-full bg-slate-700/20 rounded mb-4" />
                <div className="flex justify-between items-center mt-auto border-t border-slate-700/30 pt-3">
                    <div className="h-8 w-20 bg-slate-700/50 rounded" />
                    <div className="h-8 w-8 bg-slate-700/50 rounded-full" />
                </div>
            </div>
        );
    }

    // --- Error / Empty State ---
    if (error || !coin) {
        return (
            <div className="glass-card h-full w-full flex flex-col items-center justify-center p-6 text-center">
                <div className="text-slate-500 mb-2">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span className="text-sm font-medium">Data Unavailable</span>
                </div>
            </div>
        );
    }

    const inWatchlist = isInWatchlist(coin.id);
    const prevPriceRef = useRef(coin.current_price);
    const [priceColor, setPriceColor] = useState('text-white');

    // Live Price Logic
    const rawLivePrice = livePriceData?.[currency];
    const displayPrice = rawLivePrice !== undefined ? rawLivePrice : coin.current_price;
    const isUp = coin.price_change_percentage_24h >= 0;

    // Pulse Animation
    useEffect(() => {
        if (rawLivePrice !== undefined && rawLivePrice !== prevPriceRef.current) {
            const isHigher = rawLivePrice > prevPriceRef.current;
            setPriceColor(isHigher ? 'text-emerald-400' : 'text-rose-400');
            prevPriceRef.current = rawLivePrice;
            const timer = setTimeout(() => setPriceColor('text-white'), 1500);
            return () => clearTimeout(timer);
        }
    }, [rawLivePrice]);

    // Chart Data
    const sparklineData = {
        labels: coin.sparkline_in_7d?.price?.map((_, i) => i) || [],
        datasets: [{
            data: coin.sparkline_in_7d?.price || [],
            borderColor: isUp ? '#10b981' : '#f43f5e',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 80);
                gradient.addColorStop(0, isUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                return gradient;
            },
            borderWidth: 2,
            fill: true,
            pointRadius: 0,
            tension: 0.1
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        elements: { line: { tension: 0.1 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/coin/${coin.id}`)}
            className="glass-card hover:border-cyan-500/50 group h-full w-full max-w-full flex flex-col justify-between cursor-pointer p-4 md:p-6 overflow-hidden relative"
        >
            {/* Top Row: Info & Price */}
            <div className="flex justify-between items-start gap-2 mb-4">

                {/* Left: Coin Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full ring-2 ring-blue-500/20 shrink-0 object-cover"
                    />
                    <div className="min-w-0 flex flex-col">
                        <h3 className="font-bold text-white text-base md:text-lg truncate block leading-tight">
                            {coin.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs md:text-sm text-slate-400 font-bold tracking-wider">
                                {coin.symbol?.toUpperCase()}
                            </span>
                            <span className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                #{coin.market_cap_rank}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Price & Change */}
                <div className="flex flex-col items-end shrink-0 min-w-0 pl-2">
                    <span className={clsx(
                        "text-lg md:text-2xl font-bold tracking-tight leading-tight whitespace-nowrap transition-colors duration-300",
                        priceColor
                    )}>
                        {formatPrice(displayPrice, currency)}
                    </span>
                    <div className={clsx(
                        "flex items-center gap-1 text-sm font-bold whitespace-nowrap",
                        isUp ? "text-emerald-400" : "text-red-400"
                    )}>
                        {rawLivePrice && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />}
                        {isUp ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
                        {formatChange(coin.price_change_percentage_24h)}
                    </div>
                </div>
            </div>

            {/* Sparkline chart - Fixed Height */}
            <div className="h-16 w-full opacity-70 group-hover:opacity-100 transition-opacity mb-2">
                <Line data={sparklineData} options={chartOptions} />
            </div>

            {/* Bottom Row: Stats & Actions */}
            <div className="mt-auto pt-3 border-t border-slate-700/30 flex justify-between items-center gap-2">

                {/* Mini Stats (Volume/Cap) - Using formatter */}
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Vol</span>
                    <span className="text-xs font-semibold text-slate-300">
                        {formatCompactNumber(coin.total_volume)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleWatchlist(coin); }}
                        className={clsx(
                            "p-2 rounded-lg transition-colors",
                            inWatchlist ? "text-yellow-400 bg-yellow-400/10" : "text-slate-400 hover:text-yellow-400 hover:bg-slate-800"
                        )}
                    >
                        <Star size={18} className={inWatchlist ? "fill-current" : ""} />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); addToPortfolio(coin); }}
                        className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                    >
                        <Briefcase size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
