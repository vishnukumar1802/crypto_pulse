import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Users, Github, Twitter, Trophy, Database, Activity, Server, Globe } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
import '../../utils/chartSetup';

export default function CoinAnalytics({ coin }) {
    const [activeTab, setActiveTab] = useState('overview');
    const { formatPrice, currency } = useCurrency();

    if (!coin) return null;

    const marketData = coin.market_data;
    const commData = coin.community_data;
    const devData = coin.developer_data;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Trophy },
        { id: 'supply', label: 'Supply', icon: Database },
        { id: 'exchange', label: 'Exchanges', icon: Activity },
        { id: 'community', label: 'Community', icon: Users },
    ];

    const supplyData = {
        labels: ['Circulating', 'Remaining'],
        datasets: [{
            data: [marketData.circulating_supply, (marketData.max_supply || marketData.total_supply) - marketData.circulating_supply],
            backgroundColor: ['#06b6d4', '#1e293b'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    return (
        <div className="glass-card mt-8 overflow-hidden">
            {/* Tabs Header */}
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                                ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Icon size={16} />
                            <span className="font-medium">{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-cyan-500/10 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <AnalysisRow label="Market Cap Rank" value={`#${coin.market_cap_rank}`} highlight />
                                <AnalysisRow label="Market Cap" value={formatPrice(marketData.market_cap[currency])} />
                                <AnalysisRow label="24h Volume" value={formatPrice(marketData.total_volume[currency])} />
                                <AnalysisRow
                                    label="All-Time High"
                                    value={`${formatPrice(marketData.ath[currency])} (${marketData.ath_change_percentage[currency].toFixed(1)}%)`}
                                    trend="down"
                                />
                                <AnalysisRow
                                    label="All-Time Low"
                                    value={`${formatPrice(marketData.atl[currency])} (${marketData.atl_change_percentage[currency].toFixed(1)}%)`}
                                    trend="up"
                                />
                            </div>
                            <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5">
                                <h4 className="text-slate-400 mb-4 text-sm font-bold uppercase">Price Performance</h4>
                                <div className="space-y-3">
                                    <PerformanceBar label="24h" value={marketData.price_change_percentage_24h} />
                                    <PerformanceBar label="7d" value={marketData.price_change_percentage_7d} />
                                    <PerformanceBar label="14d" value={marketData.price_change_percentage_14d} />
                                    <PerformanceBar label="30d" value={marketData.price_change_percentage_30d} />
                                    <PerformanceBar label="1y" value={marketData.price_change_percentage_1y} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'supply' && (
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-48 h-48 relative">
                                <Doughnut data={supplyData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-xl font-bold text-white">
                                        {Math.round((marketData.circulating_supply / (marketData.max_supply || marketData.total_supply)) * 100)}%
                                    </span>
                                    <span className="text-xs text-slate-400">Minted</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <AnalysisRow label="Circulating Supply" value={`${marketData.circulating_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`} />
                                <AnalysisRow label="Total Supply" value={marketData.total_supply?.toLocaleString() || '∞'} />
                                <AnalysisRow label="Max Supply" value={marketData.max_supply?.toLocaleString() || '∞'} />
                                <AnalysisRow label="Fully Diluted Valuation" value={formatPrice(marketData.fully_diluted_valuation[currency])} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'exchange' && (
                        <div className="space-y-4">
                            <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Top Trading Pairs</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">Exchange</th>
                                            <th className="px-4 py-3">Pair</th>
                                            <th className="px-4 py-3">Price</th>
                                            <th className="px-4 py-3">Volume (24h)</th>
                                            <th className="px-4 py-3 rounded-r-lg">Trust</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {coin.tickers?.slice(0, 5).map((ticker, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 font-medium text-cyan-400">{ticker.market.name}</td>
                                                <td className="px-4 py-3 text-white">{ticker.base}/{ticker.target}</td>
                                                <td className="px-4 py-3">{formatPrice(ticker.converted_last[currency] || ticker.last)}</td>
                                                <td className="px-4 py-3 text-slate-300">${ticker.converted_volume[currency]?.toLocaleString() || ticker.volume.toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    <div className={`w-2 h-2 rounded-full ${ticker.trust_score === 'green' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'community' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <SocialCard icon={Twitter} label="Twitter Followers" value={commData.twitter_followers} color="text-blue-400" />
                            <SocialCard icon={Globe} label="Reddit Subscribers" value={commData.reddit_subscribers} color="text-orange-400" />
                            <SocialCard icon={Github} label="Github Stars" value={devData.stars} color="text-white" />

                            <div className="col-span-full mt-4 p-4 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Server size={20} className="text-purple-400" />
                                    <div>
                                        <p className="text-sm text-slate-400">Developer Score</p>
                                        <p className="font-bold text-white">{devData.developer_score.toFixed(1)} / 100</p>
                                    </div>
                                </div>
                                <div className="w-1/2 bg-slate-800 rounded-full h-2">
                                    <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: `${Math.min(devData.developer_score, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function AnalysisRow({ label, value, trend, highlight }) {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-white/5">
            <span className="text-sm text-slate-400">{label}</span>
            <span className={`font-semibold ${highlight ? 'text-cyan-400' : 'text-white'} ${trend === 'up' ? 'text-emerald-400' : ''} ${trend === 'down' ? 'text-rose-400' : ''}`}>
                {value}
            </span>
        </div>
    );
}

function PerformanceBar({ label, value }) {
    const isPositive = value >= 0;
    return (
        <div className="flex items-center gap-3 text-xs">
            <span className="w-8 text-slate-400">{label}</span>
            <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                    className={`h-full rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(Math.abs(value), 100)}%` }}
                />
            </div>
            <span className={`w-12 text-right ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {value > 0 ? '+' : ''}{value?.toFixed(1)}%
            </span>
        </div>
    );
}

function SocialCard({ icon: Icon, label, value, color }) {
    return (
        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 flex flex-col items-center text-center gap-2">
            <Icon className={color} size={24} />
            <span className="text-xs text-slate-400">{label}</span>
            <span className="text-lg font-bold text-white">{value?.toLocaleString() || 'N/A'}</span>
        </div>
    );
}
