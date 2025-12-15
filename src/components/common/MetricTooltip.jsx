import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MetricTooltip({ termKey, children, data }) {
    const [isOpen, setIsOpen] = useState(false);

    // Support generic or specific data
    const title = data?.[termKey]?.title || "Definition";
    const text = data?.[termKey]?.desc || "Explanation not found.";
    const example = data?.[termKey]?.analogy || "";

    return (
        <div className="relative inline-block" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <div className="cursor-help border-b border-dashed border-slate-500 hover:border-cyan-400 transition-colors inline-flex items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
                {children}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl p-4 z-50 pointer-events-none md:pointer-events-auto"
                    >
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-r border-b border-cyan-500/30 rotate-45"></div>

                        <div className="relative z-10">
                            <h4 className="font-bold text-cyan-400 text-sm uppercase mb-1">{title}</h4>
                            <p className="text-white text-xs mb-2 leading-relaxed">{text}</p>
                            {example && (
                                <p className="text-slate-400 text-[10px] italic border-l-2 border-slate-700 pl-2 mb-3">
                                    "{example}"
                                </p>
                            )}

                            <div className="flex gap-2 mt-2">
                                <Link to="/learn" className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded hover:bg-cyan-500/20 transition-colors w-full text-center">
                                    LEARN MORE
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
