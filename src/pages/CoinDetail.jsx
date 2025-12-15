import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOHLC } from '../api/coingecko';
import { Line } from 'react-chartjs-2';
import CoinAnalytics from '../components/coin/CoinAnalytics';
import { ArrowUp, ArrowDown, Star, Activity, Calculator, RefreshCw, BookOpen } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatPrice, formatChange, formatCompactNumber } from '../utils/formatters';
import { useLivePrices } from '../hooks/useLivePrices';
import { useFetchCoin } from '../hooks/useFetchCoin';
import clsx from 'clsx';

export default function CoinDetail() {
    const { id } = useParams();
    const { currency } = useCurrency();
    const { coin, loading, error, retry, setCoin } = useFetchCoin(id);
    const [ohlc, setOhlc] = useState(null);
    const [timeframe, setTimeframe] = useState(1); // days
    const [convertAmount, setConvertAmount] = useState(1);

    const { toggleWatchlist, isInWatchlist } = usePortfolio();

    // 30-Second Live Updates to prevent 429 Rate Limits
    const { prices: livePrice } = useLivePrices(id ? [id] : [], 30000);

    // Update coin price when live data arrives
    useEffect(() => {
        if (coin && livePrice[id]) {
            setCoin(prev => ({
                ...prev,
                market_data: {
                    ...prev.market_data,
                    current_price: {
                        ...prev.market_data.current_price,
                        [currency]: livePrice[id][currency]
                    }
                }
            }));
        }
    }, [livePrice, id, currency, setCoin, coin]);

    // OHLC Fetching
    useEffect(() => {
        if (!id) return;
        const fetchOHLC = async () => {
            try {
                const data = await getOHLC(id, timeframe, currency);
                setOhlc(data);
            } catch (err) {
                console.error("Failed to load OHLC", err);
            }
        };
        fetchOHLC();
    }, [id, timeframe, currency]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <RefreshCw className="animate-spin text-cyan-400" size={32} />
            <span className="text-slate-400 font-medium">Loading coin data...</span>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
            <div className="p-4 rounded-full bg-red-500/10 text-red-400 mb-2">
                <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-white">Unable to load coin</h2>
            <p className="text-slate-400 max-w-md">{error}</p>
            <button
                onClick={retry}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-all"
            >
                Try Again
            </button>
        </div>
    );

    if (!coin) return null;

    const marketData = coin.market_data;
    const currentPrice = marketData.current_price[currency] || 0;
    const isUp = marketData.price_change_percentage_24h >= 0;

    // Chart Data
    const chartData = {
        labels: ohlc?.map(d => new Date(d[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) || [],
        datasets: [{
            label: 'Price',
            data: ohlc?.map(d => d[4]) || [], // close price
            borderColor: isUp ? '#10b981' : '#f43f5e',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, isUp ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                return gradient;
            },
            fill: true,
            pointRadius: 0,
            tension: 0.1,
            borderWidth: 2
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: { display: false },
            y: {
                display: true,
                position: 'right',
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#94a3b8', font: { size: 10 } }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div className="pb-20 space-y-6">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-[#0F0F23]/80 backdrop-blur-xl -mx-4 px-4 py-3 border-b border-gray-800 flex items-center justify-between transition-all duration-300 shadow-xl">
                <div className="flex items-center gap-3">
                    <img src={coin.image.small} alt="icon" className="w-8 h-8 rounded-full border border-gray-600" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-lg leading-none">{coin.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">#{coin.market_cap_rank}</span>
                        </div>
                        <span className="text-xs font-bold text-cyan-400 font-mono">{coin.symbol.toUpperCase()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-lg font-bold font-mono text-white leading-none">
                            {formatPrice(currentPrice, currency)}
                        </div>
                        <span className={clsx("text-xs font-bold flex justify-end items-center gap-1", isUp ? "text-emerald-400" : "text-red-400")}>
                            {isUp ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
                            {formatChange(marketData.price_change_percentage_24h)}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => toggleWatchlist(coin)}
                            className={clsx("p-2 rounded-lg border transition-all",
                                isInWatchlist(coin.id)
                                    ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white")}
                        >
                            <Star size={18} className={isInWatchlist(coin.id) ? "fill-current" : ""} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT: Info & Converter */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass-card relative overflow-hidden p-6">
                        <div className={clsx("absolute top-0 right-0 w-48 h-48 bg-gradient-to-br opacity-20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2", isUp ? "from-emerald-500" : "from-rose-500")} />

                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <img src={coin.image.large} className="w-16 h-16 shadow-2xl rounded-full" alt={coin.name} />
                            <div>
                                <h1 className="text-2xl font-bold leading-none mb-1">{coin.name}</h1>
                                <span className="text-slate-400 font-mono inline-block px-2 py-0.5 bg-slate-800 rounded text-xs">{coin.symbol.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="mb-6 relative z-10">
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold tracking-tighter font-mono">
                                    {formatPrice(currentPrice, currency)}
                                </p>
                            </div>
                            <span className={clsx("inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded-full text-sm font-bold border", isUp ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20")}>
                                {isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                {formatChange(marketData.price_change_percentage_24h)}
                            </span>
                        </div>

                        {/* Mini Converter */}
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 space-y-3">
                            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold mb-1">
                                <Calculator size={14} />
                                <span>Converter</span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs text-slate-500">{coin.symbol.toUpperCase()}</span>
                                <input
                                    type="number"
                                    value={convertAmount}
                                    onChange={(e) => setConvertAmount(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500 text-white"
                                />
                            </div>
                            <div className="flex justify-center text-slate-500">
                                <ArrowDown size={14} />
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs text-slate-500">{currency.toUpperCase()}</span>
                                <div className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-12 pr-4 text-sm font-mono text-slate-300">
                                    {formatPrice(convertAmount * currentPrice, currency)}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => toggleWatchlist(coin)}
                                className={clsx("flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border",
                                    isInWatchlist(coin.id)
                                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                        : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500")}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Star size={16} className={isInWatchlist(coin.id) ? "fill-current" : ""} />
                                    {isInWatchlist(coin.id) ? 'Saved' : 'Watch'}
                                </div>
                            </button>
                            <button className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold transition-all shadow-lg shadow-cyan-500/20">
                                Trade
                            </button>
                        </div>
                    </div>
                </div>

                {/* MIDDLE: Chart */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="glass-card p-4 min-h-[500px] flex flex-col">
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <Activity className="text-cyan-400" size={20} />
                                Price Performance
                            </h3>
                            <div className="flex bg-slate-900/50 rounded-lg p-1 border border-white/5">
                                {[1, 7, 30, 90, 365].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setTimeframe(d)}
                                        className={clsx(
                                            "px-3 py-1 rounded-md text-xs font-medium transition-all",
                                            timeframe === d ? "bg-cyan-500/20 text-cyan-400 shadow-sm" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        {d === 1 ? '24H' : d === 365 ? '1Y' : `${d}D`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 relative w-full h-full min-h-0">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* RIGHT: Analytics */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Quick Learn Card */}
                    <div className="glass-card !p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BookOpen size={80} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase flex items-center gap-2">
                            <BookOpen size={14} className="text-cyan-400" />
                            Quick Learn
                        </h3>
                        <p className="text-sm text-white font-medium mb-3 leading-relaxed">
                            New to {coin.name}?
                            <span className="text-slate-300 block mt-1 font-normal text-xs">
                                {coin.id === 'bitcoin' ?
                                    "Bitcoin is digital gold created in 2009. It's limited to 21 million coins forever and allows global transfers without banks." :
                                    coin.id === 'ethereum' ?
                                        "Ethereum is 'digital oil'. It powers thousands of applications (dApps) and allows for smart contracts." :
                                        `${coin.name} is a cryptocurrency trading at ${formatPrice(currentPrice, currency)}. Its rank #${coin.market_cap_rank} indicates its size relative to the market.`
                                }
                            </span>
                        </p>
                        <Link to="/learn" className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-3 py-2 rounded-lg hover:bg-cyan-500/20 transition-colors w-full block text-center">
                            START CRYPTO COURSE
                        </Link>
                    </div>

                    <CoinAnalytics coin={coin} />
                </div>
            </div>
        </div>
    );
}
