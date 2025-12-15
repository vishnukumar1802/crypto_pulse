import { usePortfolio } from '../hooks/usePortfolio';
import { useMarket } from '../contexts/MarketContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Trash2, PlusCircle, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatCurrency } from '../utils/indicators';
import toast from 'react-hot-toast';
import { useCurrency } from '../contexts/CurrencyContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Portfolio() {
    const { portfolio, removeFromPortfolio, addToPortfolio } = usePortfolio();
    const { coins } = useMarket();
    const { currency } = useCurrency();
    const [isAdding, setIsAdding] = useState(false);
    const [newCoinId, setNewCoinId] = useState('bitcoin');
    const [amount, setAmount] = useState('');
    const [avgPrice, setAvgPrice] = useState('');

    // Calculate generic P&L
    const portfolioData = useMemo(() => {
        if (!portfolio || !coins.length) return { totalValue: 0, holdings: [] };

        const holdings = portfolio.map(item => {
            const liveCoin = coins.find(c => c.id === item.coinId);
            // If live coin data isn't available (e.g. not in first 50), fall back to avgPrice (not ideal but avoids crash)
            // ideally we'd fetch specific coin data if missing.
            const currentPrice = liveCoin ? liveCoin.current_price : item.avgPrice;
            const currentValue = currentPrice * item.amount;
            const costBasis = item.avgPrice * item.amount;
            const pnl = currentValue - costBasis;
            const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

            return {
                ...item,
                currentPrice,
                currentValue,
                pnl,
                pnlPercent,
                image: liveCoin?.image || '',
                symbol: item.symbol // Saved in portfolio item
            };
        });

        const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
        const totalCost = holdings.reduce((sum, h) => sum + (h.avgPrice * h.amount), 0);
        const totalPnl = totalValue - totalCost;
        const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

        return { totalValue, totalPnl, totalPnlPercent, holdings };
    }, [portfolio, coins, currency]);

    // Chart Data
    const chartData = {
        labels: portfolioData.holdings.map(h => h.symbol.toUpperCase()),
        datasets: [{
            data: portfolioData.holdings.map(h => h.currentValue),
            backgroundColor: [
                '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#6366f1'
            ],
            borderWidth: 0,
        }]
    };

    const submitAdd = (e) => {
        e.preventDefault();
        const coin = coins.find(c => c.id === newCoinId);
        if (coin) {
            addToPortfolio({
                id: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                amount: Number(amount),
                price: Number(avgPrice)
            });
            setIsAdding(false);
            setAmount('');
            setAvgPrice('');
            toast.success("Added to Portfolio");
        }
    };

    if (!portfolio) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-20">
            {/* Overview Panel */}
            <div className="lg:w-1/3 space-y-6">
                <div className="glass-card relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Wallet size={64} className="text-cyan-500" /></div>
                    <p className="text-slate-400 mb-1 font-medium">Total Balance</p>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none mb-2">
                        {formatCurrency(portfolioData.totalValue, currency)}
                    </h1>
                    <div className={clsx("flex items-center gap-2 text-sm font-bold", portfolioData.totalPnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {portfolioData.totalPnl >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{formatCurrency(Math.abs(portfolioData.totalPnl), currency)} ({portfolioData.totalPnlPercent.toFixed(2)}%)</span>
                    </div>
                </div>

                <div className="glass-card h-80 flex items-center justify-center p-4">
                    {portfolioData.holdings.length > 0 ? (
                        <div className="w-full h-full">
                            <Doughnut
                                data={chartData}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20 } } }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="text-center text-slate-500">
                            <p className="mb-2">Portfolio Empty</p>
                            <p className="text-xs">Add assets to visualize allocation</p>
                        </div>
                    )}
                </div>

                {!isAdding ? (
                    <button onClick={() => setIsAdding(true)} className="neon-btn w-full flex items-center justify-center gap-2">
                        <PlusCircle /> Add Asset
                    </button>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={submitAdd}
                        className="glass-card !p-4 space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-white">Add Transaction</h3>
                            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white">&times;</button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Asset</label>
                                <select
                                    className="input-glass w-full"
                                    value={newCoinId}
                                    onChange={e => {
                                        setNewCoinId(e.target.value);
                                        const c = coins.find(coin => coin.id === e.target.value);
                                        if (c) setAvgPrice(c.current_price);
                                    }}
                                >
                                    {coins.slice(0, 50).map(c => <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Quantity</label>
                                    <input type="number" placeholder="0.00" className="input-glass w-full" value={amount} onChange={e => setAmount(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Buy Price</label>
                                    <input type="number" placeholder="0.00" className="input-glass w-full" value={avgPrice} onChange={e => setAvgPrice(e.target.value)} required />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl py-2.5 transition-colors">
                                Add
                            </button>
                        </div>
                    </motion.form>
                )}
            </div>

            {/* Holdings List */}
            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                    <Wallet className="text-cyan-400" /> Your Assets
                </h2>
                <div className="space-y-4">
                    {portfolioData.holdings.map((item) => (
                        <div key={item.id} className="glass-card !p-4 flex items-center justify-between group hover:border-cyan-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                {item.image ? (
                                    <img src={item.image} alt={item.symbol} className="w-10 h-10 rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">{item.symbol[0]}</div>
                                )}
                                <div>
                                    <p className="font-bold text-white text-lg leading-none mb-1">{item.name}</p>
                                    <p className="text-sm text-slate-400 font-mono">{item.amount} {item.symbol.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-white text-lg tracking-tight">{formatCurrency(item.currentValue, currency)}</p>
                                <p className={clsx("text-sm font-bold", item.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                    {item.pnl >= 0 ? "+" : ""}{item.pnlPercent.toFixed(2)}%
                                </p>
                            </div>

                            <button
                                onClick={() => removeFromPortfolio(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all absolute right-4 md:static"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}

                    {!portfolioData.holdings.length && (
                        <div className="glass-card text-center py-20 text-slate-500">
                            <Wallet size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No assets in portfolio</p>
                            <p className="text-sm">Add your first holding to start tracking</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
