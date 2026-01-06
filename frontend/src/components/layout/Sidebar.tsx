import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Brain,
    TrendingUp,
    Settings,
    Sparkles
} from 'lucide-react';
import { animation } from '../../styles/design-tokens';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/profile' },
    { icon: TrendingUp, label: 'Analytics', path: '/dashboard' },
    { icon: Brain, label: 'My Skills', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/profile' },
];

export const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <TooltipProvider delayDuration={200}>
            <motion.aside
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    duration: 0.5,
                    delay: animation.stagger.sidebar / 1000,
                    ease: [0, 0, 0.2, 1]
                }}
                className="fixed left-0 top-0 h-screen w-20 bg-[#0B0E14] border-r border-white/5 flex flex-col items-center py-8 z-50"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: (animation.stagger.sidebar + 100) / 1000,
                        type: 'spring',
                        stiffness: 200
                    }}
                    className="mb-12 relative"
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                        <Sparkles className="w-6 h-6 text-white relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 blur-xl -z-10 animate-pulse" />
                </motion.div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-2 w-full px-3">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Tooltip key={item.path}>
                                <TooltipTrigger asChild>
                                    <Link to={item.path}>
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: (animation.stagger.sidebar + 200 + (index * 50)) / 1000
                                            }}
                                            className={`
                        relative w-14 h-14 rounded-xl flex items-center justify-center
                        transition-all duration-250 cursor-pointer group
                        ${isActive
                                                    ? 'bg-blue-500/10 text-blue-400'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }
                      `}
                                        >
                                            <Icon className="w-5 h-5 relative z-10" />

                                            {/* Active indicator */}
                                            {isActive && (
                                                <>
                                                    <motion.div
                                                        layoutId="activeIndicator"
                                                        className="absolute inset-0 rounded-xl bg-blue-500/10 border border-blue-500/30"
                                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                    />
                                                    <div className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                                                </>
                                            )}

                                            {/* Hover glow */}
                                            {!isActive && (
                                                <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-250" />
                                            )}
                                        </motion.div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    sideOffset={12}
                                >
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Bottom indicator */}
                <div className="w-8 h-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 opacity-50" />
            </motion.aside>
        </TooltipProvider>
    );
};
