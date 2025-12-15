import { useCurrency } from '../../contexts/CurrencyContext';

export default function CurrencySelector({ className = '' }) {
    const { currency, setCurrency, supportedCurrencies } = useCurrency();

    return (
        <div className={`relative ${className}`}>
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="appearance-none bg-slate-800/50 border border-slate-700/50 rounded-xl pl-4 pr-10 py-2 text-white 
                           focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50
                           cursor-pointer hover:bg-slate-700/50 transition-all font-medium uppercase"
            >
                {supportedCurrencies.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                        {c.toUpperCase()}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
}
