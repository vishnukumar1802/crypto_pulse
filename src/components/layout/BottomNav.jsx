import { Coins, Briefcase, Star, Settings, Home, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export default function BottomNav() {
    const links = [
        { name: 'Home', to: '/', icon: Home },
        { name: 'Watch', to: '/watchlist', icon: Star },
        { name: 'Port', to: '/portfolio', icon: Briefcase },
        { name: 'Learn', to: '/learn', icon: BookOpen },
        { name: 'Set', to: '/settings', icon: Settings },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-2 lg:hidden z-50 pb-safe">
            <div className="flex justify-around items-center">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.to}
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                            isActive ? "text-cyan-400" : "text-slate-500"
                        )}
                    >
                        <link.icon className={clsx("w-6 h-6", (({ isActive }) => isActive && "animate-bounce"))} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">{link.name}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
