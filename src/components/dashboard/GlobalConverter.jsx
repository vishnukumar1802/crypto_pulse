import { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { getSimplePrice } from '../../api/coingecko';
import { useCurrency } from '../../contexts/CurrencyContext';

const POPULAR_FIAT = ['usd', 'eur', 'inr', 'jpy', 'gbp'];
const FLAGS = {
    usd: '🇺🇸', eur: '🇪🇺', inr: '🇮🇳', jpy: '🇯🇵', gbp: '🇬🇧',
    cad: '🇨🇦', aud: '🇦🇺', cny: '🇨🇳', rub: '🇷🇺', brl: '🇧🇷'
};

export default function GlobalConverter() {
    const { supportedCurrencies } = useCurrency();
    const [btcPrices, setBtcPrices] = useState(null);
    const [amount, setAmount] = useState(1);
    const [targetFiat, setTargetFiat] = useState('usd');
    const [loading, setLoading] = useState(true);

    const fetchPrices = async () => {
        try {
            // Fetch BTC in popular currencies + target currency
            const fiats = [...new Set([...POPULAR_FIAT, targetFiat])];
            const data = await getSimplePrice('bitcoin', fiats.join(','));
            setBtcPrices(data.bitcoin);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, [targetFiat]);

    const formatVal = (val, fiat) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: fiat.toUpperCase(),
            maximumFractionDigits: 0
        }).format(val);
    };

    if (loading || !btcPrices) return (
        <div className="h-32 w-full bg-slate-900/50 animate-pulse rounded-2xl mb-8 border border-white/5" />
    );

    const convertedValue = (btcPrices[targetFiat] || 0) * amount;

    return (
        <div className="w-full mb-8">
            {/* Ticker Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between text-sm text-slate-400 mb-4 px-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                <div className="flex items-center gap-6">
                    <span className="font-bold text-white">1 BTC =</span>
                    {POPULAR_FIAT.map(fiat => (
                        <div key={fiat} className="flex items-center gap-1">
                            <span>{formatVal(btcPrices[fiat], fiat)}</span>
                            <span className="opacity-75">[{FLAGS[fiat] || '🌍'} {fiat.toUpperCase()}]</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Converter Card */}
            <div className="glass-card flex flex-col xl:flex-row items-center gap-6 p-6">
                <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                        <img src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png" alt="BTC" className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl text-white">Bitcoin</span>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-4 w-full items-center">
                    <div className="relative w-full">
                        <label className="absolute -top-2.5 left-3 text-xs bg-[#111827] px-1 text-cyan-400 font-bold z-10">Amount (BTC)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className="input-glass w-full text-lg"
                        />
                    </div>

                    <ArrowRight className="text-slate-500 hidden md:block shrink-0" />
                    <div className="w-full md:hidden h-px bg-slate-700/50 my-2 relative">
                        <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-[#111827] p-1 text-slate-500">
                            <ArrowRight size={16} className="rotate-90" />
                        </div>
                    </div>

                    <div className="relative w-full">
                        <label className="absolute -top-2.5 left-3 text-xs bg-[#111827] px-1 text-purple-400 font-bold z-10">ConvertTo</label>
                        <select
                            value={targetFiat}
                            onChange={(e) => setTargetFiat(e.target.value)}
                            className="input-glass w-full appearance-none cursor-pointer uppercase text-lg"
                        >
                            {supportedCurrencies.map(c => (
                                <option key={c} value={c} className="bg-slate-900 text-white">
                                    {c.toUpperCase()} - {FLAGS[c] || '🌍'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative w-full">
                        <div className="input-glass bg-slate-800/80 border-cyan-500/30 font-mono text-xl font-bold text-cyan-400 flex items-center h-[52px]">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: targetFiat.toUpperCase() }).format(convertedValue)}
                        </div>
                        <label className="absolute -top-2.5 right-3 text-xs bg-[#111827] px-1 text-slate-400 font-bold z-10">Result</label>
                    </div>
                </div>
            </div>
        </div>
    );
}
