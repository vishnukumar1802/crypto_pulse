import { useState } from 'react';
import { LESSONS, BEGINNER_TERMS, GLOSSARY } from '../data/learnData';
import { BookOpen, CheckCircle, GraduationCap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Learn() {
    const [completedLessons, setCompletedLessons] = useState([1]); // Mock progress
    const [activeTab, setActiveTab] = useState('lessons'); // lessons, glossary

    const toggleComplete = (id) => {
        if (completedLessons.includes(id)) {
            setCompletedLessons(completedLessons.filter(i => i !== id));
        } else {
            setCompletedLessons([...completedLessons, id]);
        }
    };

    const progress = (completedLessons.length / LESSONS.length) * 100;

    return (
        <div className="min-h-screen pb-20 space-y-8">
            {/* Header */}
            <div className="glass-card !p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <GraduationCap size={120} className="text-cyan-500" />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                        Crypto Academy
                    </h1>
                    <p className="text-slate-400 max-w-lg">
                        Master the basics of cryptocurrency in minutes. Simple explanations for complex topics.
                    </p>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-white">Your Progress</span>
                        <span className="text-cyan-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-600"
                        />
                    </div>
                    {progress === 100 && (
                        <p className="text-xs text-emerald-400 mt-2 font-bold animate-pulse">
                            🎓 Portfolio Pro Unlocked!
                        </p>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-1">
                <button
                    onClick={() => setActiveTab('lessons')}
                    className={`pb-3 px-2 font-bold transition-all ${activeTab === 'lessons' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-white'}`}
                >
                    Lessons
                </button>
                <button
                    onClick={() => setActiveTab('glossary')}
                    className={`pb-3 px-2 font-bold transition-all ${activeTab === 'glossary' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-white'}`}
                >
                    Glossary
                </button>
            </div>

            {/* Content */}
            {activeTab === 'lessons' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {LESSONS.map((lesson) => (
                        <motion.div
                            key={lesson.id}
                            whileHover={{ y: -5 }}
                            className={`glass-card !p-0 group cursor-pointer border ${completedLessons.includes(lesson.id) ? 'border-emerald-500/30' : 'border-slate-700/50'}`}
                            onClick={() => toggleComplete(lesson.id)}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-4xl">{lesson.icon}</span>
                                    {completedLessons.includes(lesson.id) ? (
                                        <CheckCircle className="text-emerald-500" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-600" />
                                    )}
                                </div>
                                <h3 className="font-bold text-xl text-white mb-2">{lesson.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    {lesson.content}
                                </p>
                                <div className="flex items-center text-xs font-bold text-slate-500">
                                    <BookOpen size={14} className="mr-1" />
                                    {lesson.duration} read
                                </div>
                            </div>
                            <div className={`h-1 w-full ${completedLessons.includes(lesson.id) ? 'bg-emerald-500' : 'bg-slate-800 group-hover:bg-cyan-500/50'} transition-colors`} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Quick Terms */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {BEGINNER_TERMS.map((term, i) => (
                            <div key={i} className="glass-card !p-4 hover:bg-slate-800/80 transition-colors">
                                <h4 className="font-bold text-cyan-400 mb-1">{term.term}</h4>
                                <p className="text-sm text-slate-300">{term.def}</p>
                            </div>
                        ))}
                    </div>

                    {/* Deep Dive Glossary */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Core Concepts</h3>
                        <div className="space-y-4">
                            {Object.entries(GLOSSARY).map(([key, item]) => (
                                <div key={key} className="glass-card !p-5">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                        <h4 className="text-lg font-bold text-white">{item.title}</h4>
                                        <span className="text-xs bg-slate-800 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20 font-mono">
                                            {item.simple}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-2">{item.desc}</p>
                                    <p className="text-xs text-slate-500 italic">💡 {item.analogy}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
