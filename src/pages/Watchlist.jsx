import { usePortfolio } from '../hooks/usePortfolio';
import { useMarket } from '../contexts/MarketContext';
import CoinCard from '../components/CoinCard';
import { Star } from 'lucide-react';

export default function Watchlist() {
    const { watchlist } = usePortfolio();
    const { coins, loading } = useMarket();

    if (loading) return <div>Loading...</div>;

    // Filter global coins list by watchlist IDs
    const watchlistCoins = coins.filter(c => watchlist?.some(w => w.coinId === c.id));

    if (!watchlistCoins.length) {
        return (
            <div className="text-center py-20 opacity-50">
                <Star size={64} className="mx-auto mb-4 text-slate-700" />
                <h2 className="text-xl font-bold">Your watchlist is empty</h2>
                <p>Star coins to track them here</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Your Watchlist</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {watchlistCoins.map((coin, index) => (
                    <CoinCard key={coin.id} coin={coin} index={index} />
                ))}
            </div>
        </div>
    );
}
