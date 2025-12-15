export default function Settings() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="card space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                    <div>
                        <p className="font-semibold">Push Notifications</p>
                        <p className="text-sm text-slate-400">Get alerts on price changes</p>
                    </div>
                    <div className="w-12 h-6 bg-cyan-500/20 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-cyan-400 rounded-full shadow-lg" />
                    </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                    <div>
                        <p className="font-semibold">Compact Mode</p>
                        <p className="text-sm text-slate-400">Dense specific lists</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full shadow-lg" />
                    </div>
                </div>

                <div className="pt-2">
                    <p className="text-xs text-slate-500 text-center">Crypto Pulse v1.0.0</p>
                </div>
            </div>
        </div>
    );
}
