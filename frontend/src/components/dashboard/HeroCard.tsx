import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target } from 'lucide-react';
import { animation } from '../../styles/design-tokens';

interface HeroCardProps {
    skillCount: number;
    completionPercentage: number;
    aiInsight?: string;
}

export const HeroCard: React.FC<HeroCardProps> = ({
    skillCount,
    completionPercentage,
    aiInsight = "Your skill portfolio shows strong growth in emerging technologies. Continue building expertise in AI and cloud computing for maximum market impact."
}) => {
    const [progress, setProgress] = useState(0);

    // Animate progress ring on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(completionPercentage);
        }, 500);
        return () => clearTimeout(timer);
    }, [completionPercentage]);

    const circumference = 2 * Math.PI * 58; // radius = 58
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay: animation.stagger.cards / 1000,
                ease: [0, 0, 0.2, 1]
            }}
            className="col-span-12 relative group"
        >
            {/* Glass card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-xl border border-white/10 p-8">
                {/* Animated gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Subtle pulse glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-gradient-to-b from-blue-500/20 to-transparent blur-3xl animate-pulse" />

                <div className="relative z-10 flex items-center justify-between">
                    {/* Left: Text Content */}
                    <div className="flex-1 max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                    Your Skill Evolution Trajectory
                                </h2>
                                <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    AI-powered career intelligence
                                </p>
                            </div>
                        </div>

                        {/* AI Insight */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (animation.stagger.cards + 200) / 1000 }}
                            className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm"
                        >
                            <p className="text-slate-300 text-sm leading-relaxed">
                                {aiInsight}
                            </p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (animation.stagger.cards + 300) / 1000 }}
                            className="flex gap-6 mt-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{skillCount}</p>
                                    <p className="text-xs text-slate-500">Active Skills</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{completionPercentage}%</p>
                                    <p className="text-xs text-slate-500">Career Readiness</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Animated Progress Ring */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.6,
                            delay: (animation.stagger.cards + 100) / 1000,
                            type: 'spring',
                            stiffness: 200
                        }}
                        className="relative"
                    >
                        <svg width="160" height="160" className="transform -rotate-90">
                            {/* Background circle */}
                            <circle
                                cx="80"
                                cy="80"
                                r="58"
                                stroke="rgba(255, 255, 255, 0.05)"
                                strokeWidth="12"
                                fill="none"
                            />
                            {/* Progress circle with gradient */}
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="50%" stopColor="#8B5CF6" />
                                    <stop offset="100%" stopColor="#06B6D4" />
                                </linearGradient>
                            </defs>
                            <motion.circle
                                cx="80"
                                cy="80"
                                r="58"
                                stroke="url(#progressGradient)"
                                strokeWidth="12"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                style={{
                                    strokeDasharray: circumference,
                                    filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
                                }}
                            />
                        </svg>

                        {/* Center text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (animation.stagger.cards + 400) / 1000 }}
                                    className="text-4xl font-bold bg-gradient-to-br from-blue-400 to-violet-400 bg-clip-text text-transparent"
                                >
                                    {progress}%
                                </motion.p>
                                <p className="text-xs text-slate-500 mt-1">Complete</p>
                            </div>
                        </div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-full blur-2xl -z-10 animate-pulse" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};
