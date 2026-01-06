import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface OpportunityCardProps {
    skill: string;
    type: 'peer' | 'improve' | 'prerequisite' | 'discovery' | 'new';
    demandScore?: number | string;
    growthRate?: number | string;
    reason?: string;
    resource?: {
        url: string;
        provider: string;
    };
    index?: number;
}

const getTypeConfig = (type: string) => {
    const configs = {
        peer: { label: 'Popular with Peers', color: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
        improve: { label: 'Upskill Opportunity', color: 'from-violet-500 to-purple-500', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/30' },
        prerequisite: { label: 'Foundational', color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30' },
        discovery: { label: 'AI Discovery', color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
        new: { label: 'Strategic Goal', color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
    };
    return configs[type as keyof typeof configs] || configs.new;
};

const getTrendIcon = (growthRate: number | string | undefined) => {
    if (!growthRate) return Minus;
    const rate = typeof growthRate === 'string' ? parseFloat(growthRate) : growthRate;
    if (rate > 10) return TrendingUp;
    if (rate < -10) return TrendingDown;
    return Minus;
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
    skill,
    type,
    demandScore,
    growthRate,
    reason,
    resource,
    index = 0
}) => {
    const config = getTypeConfig(type);
    const TrendIcon = getTrendIcon(growthRate);
    const growthValue = typeof growthRate === 'string' ? parseFloat(growthRate) : (growthRate || 0);

    return (
        <TooltipProvider delayDuration={200}>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0, 0, 0.2, 1]
                }}
                whileHover={{ y: -6 }}
                className="group relative h-full"
            >
                {/* Glass card */}
                <div className={`relative overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-sm border ${config.borderColor} p-6 h-full flex flex-col transition-all duration-300 group-hover:border-opacity-60 group-hover:bg-slate-900/60`}>
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                    {/* Header */}
                    <div className="relative z-10 flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors mb-2">
                                {skill}
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.bgColor} border ${config.borderColor} text-xs font-medium bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                                {type === 'discovery' && <Sparkles className="w-3 h-3" style={{ color: 'currentColor', WebkitTextFillColor: 'currentColor' }} />}
                                {config.label}
                            </span>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="relative z-10 space-y-3 mb-4">
                        {demandScore && (
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Market Demand</span>
                                    <span className="text-slate-300 font-mono font-medium">{demandScore}</span>
                                </div>
                                {/* Animated demand bar */}
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(Number(demandScore) || 0, 100)}%` }}
                                        transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: 'easeOut' }}
                                        className={`h-full bg-gradient-to-r ${config.color} relative`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                    </motion.div>
                                </div>
                            </div>
                        )}

                        {growthRate !== undefined && (
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-white/5">
                                <span className="text-xs text-slate-500">Growth Trend</span>
                                <div className="flex items-center gap-1.5">
                                    <TrendIcon className={`w-4 h-4 ${growthValue > 0 ? 'text-emerald-400' : growthValue < 0 ? 'text-red-400' : 'text-slate-400'}`} />
                                    <span className={`text-sm font-mono font-bold ${growthValue > 0 ? 'text-emerald-400' : growthValue < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                        {growthValue > 0 ? '+' : ''}{growthValue}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Insight */}
                    {reason && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.08 + 0.4 }}
                                    className="relative z-10 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 mb-4 cursor-help"
                                >
                                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                        {reason}
                                    </p>
                                </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                                <p className="leading-relaxed">{reason}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}

                    {/* Learning Resource */}
                    {resource && (
                        <motion.a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative z-10 mt-auto flex items-center justify-between px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-250 group/link"
                        >
                            <span className="text-sm font-medium text-blue-300">
                                Learn on {resource.provider}
                            </span>
                            <ExternalLink className="w-4 h-4 text-blue-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </motion.a>
                    )}

                    {/* Glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-10 blur-2xl`} />
                    </div>
                </div>
            </motion.div>
        </TooltipProvider>
    );
};
