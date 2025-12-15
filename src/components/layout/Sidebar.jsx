import { Coins, Briefcase, Star, Settings, Home, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
    const { currentUser } = useAuth();

    const links = [
        { name: 'Dashboard', to: '/', icon: Home },
        { name: 'Watchlist', to: '/watchlist', icon: Star },
        { name: 'Portfolio', to: '/portfolio', icon: Briefcase },
        { name: 'Learn', to: '/learn', icon: BookOpen },
        { name: 'Settings', to: '/settings', icon: Settings },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 z-50">
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 animate-pulse" />
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    CryptoPulse
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.to}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group",
                            isActive
                                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-400 shadow-lg shadow-cyan-900/20 border-l-4 border-cyan-500"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <link.icon className="w-6 h-6" />
                        <span className="font-medium">{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-800">
                {currentUser ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center text-sm font-bold">
                            {currentUser.email[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{currentUser.email}</p>
                            <p className="text-xs text-slate-500">Pro Plan</p>
                        </div>
                    </div>
                ) : (
                    <NavLink to="/login" className="btn-neon w-full block text-center py-3 text-sm">
                        Login / Join
                    </NavLink>
                )}
            </div>
        </aside>
    );
}
