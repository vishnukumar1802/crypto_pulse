import { Search, Bell, Mic, MicOff } from 'lucide-react';
import CurrencySelector from '../common/CurrencySelector';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { useEffect, useState } from 'react';
import { useMarket } from '../../contexts/MarketContext';
import { formatCompactNumber } from '../../utils/indicators';

export default function Header() {
    const { currency, symbol } = useCurrency();
    const { isListening, transcript, startListening, isSupported } = useVoiceSearch();
    const [searchValue, setSearchValue] = useState('');
    const { globalStats } = useMarket();

    useEffect(() => {
        if (transcript) {
            setSearchValue(transcript);
        }
    }, [transcript]);

    return (
        <header className="sticky top-0 z-50 bg-[#0F0F23]/95 backdrop-blur-3xl border-b border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">

                    {/* LOGO + STATS */}
                    <div className="flex items-center justify-between lg:justify-start mb-4 lg:mb-0 flex-wrap gap-4 w-full lg:w-auto">
                        <div className="lg:hidden font-black text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Crypto Pulse
                        </div>

                        {/* Global Stats - Horizontal Scroll Mobile */}
                        <div className="hidden md:flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:pb-0 lg:overflow-visible flex-1 lg:flex-none">
                            <div className="glass-card px-4 py-2 text-sm whitespace-nowrap min-w-[110px] flex items-center gap-2">
                                <span className="text-slate-400">Market Cap</span>
                                <span className="font-bold text-white">
                                    {symbol}{formatCompactNumber(globalStats?.total_market_cap?.[currency] || 0)}
                                </span>
                            </div>
                            <div className="glass-card px-4 py-2 text-sm whitespace-nowrap min-w-[90px] flex items-center gap-2">
                                <span className="text-slate-400">BTC</span>
                                <span className="font-bold text-amber-400">{globalStats?.market_cap_percentage?.btc.toFixed(1)}%</span>
                            </div>
                        </div>

                        {/* Mobile Profile/Currency (Moved to row 1 on mobile for space) */}
                        <div className="flex lg:hidden items-center gap-3">
                            <CurrencySelector className="scale-90" />
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-white/10">
                                VK
                            </div>
                        </div>
                    </div>

                    {/* SEARCH + ACTIONS */}
                    <div className="flex items-center gap-3 flex-1 lg:flex-none w-full">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md group">
                            <input
                                className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 
                                           rounded-2xl focus:border-cyan-400 focus:outline-none text-white 
                                           placeholder-gray-500 pl-10 transition-all group-hover:bg-white/10"
                                placeholder="Search coins..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />

                            {isSupported && (
                                <button
                                    onClick={startListening}
                                    className={`absolute right-3 top-2.5 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-cyan-400'}`}
                                >
                                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                                </button>
                            )}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex gap-2 items-center">
                            <CurrencySelector />

                            <button className="glass-card p-2.5 text-slate-400 hover:text-white relative">
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                            </button>

                            <div className="flex items-center gap-3 pl-3 border-l border-white/10 ml-2">
                                <div className="text-right hidden xl:block">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Portfolio</p>
                                    <p className="font-bold text-emerald-400 text-sm">+$2,450.00</p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-cyan-500/20 cursor-pointer hover:scale-105 transition-transform">
                                    VK
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
