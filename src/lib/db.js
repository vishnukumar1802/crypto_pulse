import Dexie from 'dexie';

export const db = new Dexie('CryptoPulseDB');

db.version(1).stores({
    watchlist: '++id, coinId, symbol, name, addedAt',
    portfolio: '++id, coinId, symbol, amount, avgPrice, date',
    settings: 'key, value'
});
