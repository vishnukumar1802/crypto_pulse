import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

export function usePortfolio() {
    const portfolio = useLiveQuery(() => db.portfolio.toArray());
    const watchlist = useLiveQuery(() => db.watchlist.toArray());

    const addToPortfolio = async (coin) => {
        try {
            await db.portfolio.add({
                coinId: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                amount: Number(coin.amount),
                avgPrice: Number(coin.price),
                date: new Date()
            });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const removeFromPortfolio = async (id) => {
        await db.portfolio.delete(id);
    };

    const toggleWatchlist = async (coin) => {
        const exists = await db.watchlist.where('coinId').equals(coin.id).first();
        if (exists) {
            await db.watchlist.delete(exists.id);
            return false; // removed
        } else {
            await db.watchlist.add({
                coinId: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                addedAt: new Date()
            });
            return true; // added
        }
    };

    const isInWatchlist = (coinId) => {
        return watchlist?.some(w => w.coinId === coinId);
    };

    return {
        portfolio,
        watchlist,
        addToPortfolio,
        removeFromPortfolio,
        toggleWatchlist,
        isInWatchlist
    };
}
