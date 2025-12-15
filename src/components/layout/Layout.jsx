import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { Toaster } from 'react-hot-toast';
import ParticlesBackground from '../common/ParticlesBackground';
import Header from './Header';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex text-white font-sans selection:bg-cyan-500/30">
            <ParticlesBackground />
            <Sidebar />

            <main className="flex-1 lg:ml-64 pb-20 lg:pb-0 px-4 pt-0 lg:px-8 lg:pt-0 max-w-7xl mx-auto w-full">
                <Header />
                <div className="pt-4 lg:pt-8">
                    {children}
                </div>
            </main>

            <BottomNav />
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid #334155',
                    },
                }}
            />
        </div>
    );
}
