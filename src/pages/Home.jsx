import { useState, useMemo } from 'react';
import { useMarket } from '../contexts/MarketContext';
import CoinCard from '../components/CoinCard';
import GlobalStats from '../components/GlobalStats';
import GlobalConverter from '../components/dashboard/GlobalConverter';
import SearchBar from '../components/common/SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, RefreshCw, Layers } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLivePrices } from '../hooks/useLivePrices';

export default function Home() {
    const { coins, loading, refreshData, loadMore, hasMore } = useMarket();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, gainers, losers, vol
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshData();
        setIsRefreshing(false);
    };

    const filteredCoins = useMemo(() => {
        let result = coins;

        // Search - if searching, we filter LOCALLY from loaded coins. 
        if (search) {
            const lower = search.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(lower) ||
                c.symbol.toLowerCase().includes(lower)
            );
        }

        // Filter
        switch (filter) {
            case 'gainers':
                return result.filter(c => c.price_change_percentage_24h > 0).sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
            case 'losers':
                return result.filter(c => c.price_change_percentage_24h < 0).sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
            case 'vol':
                return [...result].sort((a, b) => b.total_volume - a.total_volume);
            default:
                return result;
        }
    }, [coins, search, filter]);

    // Live Updates for visible coins (limit to top 15 to avoid massive API URL requests)
    // Updated to 10s interval to prevent 429 Rate Limits on free tier
    const liveCoinIds = useMemo(() => filteredCoins.slice(0, 15).map(c => c.id), [filteredCoins]);
    const { prices: livePrices } = useLivePrices(liveCoinIds, 10000);

    return (
        <div className="min-h-screen pb-20">
            {/* Header / Title Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
                        Crypto Pulse
                    </h1>
                    <p className="text-slate-400 font-medium flex items-center gap-2">
                        Real-time market intelligence <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        className={`p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition-all
              ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-slate-400'}
            `}
                    >
                        <RefreshCw size={20} />
                    </button>
                    {/* Placeholder for layout toggle if needed */}
                </div>
            </div>

            {/* Currency Ticker & Converter */}
            <GlobalConverter />

            {/* Market Stats */}
            <GlobalStats />

            {/* Sticky Search & Filter Bar */}
            <div className="sticky top-20 lg:top-4 z-40 bg-[#0F0F23]/95 backdrop-blur-xl p-4 -mx-4 md:mx-0 md:p-4 md:border md:border-white/5 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl transition-all duration-300">
                <SearchBar value={search} onChange={setSearch} />

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                    {['all', 'gainers', 'losers', 'vol'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`
                px-5 py-2.5 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all border
                ${filter === f
                                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                    : 'bg-slate-800/50 text-slate-400 border-transparent hover:border-slate-600 hover:text-white'}
              `}
                        >
                            {f === 'vol' ? 'High Vol' : f}
                        </button>
                    ))}
                </div>
            </div>

            {loading && !coins.length && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2560px]:grid-cols-6 gap-6 max-w-7xl mx-auto">
                    {[...Array(8)].map((_, i) => (
                        <CoinCard key={i} isLoading={true} />
                    ))}
                </div>
            )}

            {!loading && !coins.length && (
                <div className="text-center py-20 text-slate-500">
                    <Filter size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium text-slate-400">Unable to load markets</p>
                    <p className="text-sm opacity-60 mt-1 max-w-md mx-auto">
                        The public API might be rate-limited. Please wait a moment and try refreshing.
                    </p>
                    <button
                        onClick={handleRefresh}
                        className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all"
                    >
                        Retry Now
                    </button>
                </div>
            )}

            {!loading && coins.length > 0 && (
                <InfiniteScroll
                    dataLength={filteredCoins.length}
                    next={loadMore}
                    hasMore={hasMore && !search && filter === 'all'} // Disable infinite scroll when searching/filtering for simplicity in this demo logic
                    loader={
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                        </div>
                    }
                    endMessage={
                        <div className="text-center py-10 text-slate-500 font-medium">
                            <div className="flex justify-center mb-2"><Layers size={24} /></div>
                            <p>End of list</p>
                        </div>
                    }
                    className="!overflow-visible" // Override default overflow hidden
                >
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2560px]:grid-cols-6 gap-6 max-w-7xl mx-auto"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredCoins.map((coin, index) => (
                                <CoinCard
                                    key={`${coin.id}-${index}`}
                                    coin={coin}
                                    index={index % 20}
                                    livePriceData={livePrices[coin.id]}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </InfiniteScroll>
            )}

            {!loading && filteredCoins.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <Filter size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No coins found matching your criteria</p>
                </div>
            )}
        </div>
    );
}
