import React from 'react';
import { motion } from 'framer-motion';
import { Bell, LogOut, User } from 'lucide-react';
import { animation } from '../../styles/design-tokens';

interface HeaderProps {
    title: string;
    subtitle?: string;
    userName?: string;
    onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle = 'AI-powered insights for your career growth',
    userName = 'User',
    onLogout
}) => {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.5,
                delay: animation.stagger.header / 1000,
                ease: [0, 0, 0.2, 1]
            }}
            className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-xl"
        >
            <div className="flex items-center justify-between px-8 py-5">
                {/* Left: Title & Subtitle */}
                <div className="flex-1">
                    <motion.h1
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (animation.stagger.header + 100) / 1000 }}
                        className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-violet-200 bg-clip-text text-transparent"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (animation.stagger.header + 150) / 1000 }}
                        className="text-sm text-slate-400 mt-1 flex items-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {subtitle}
                    </motion.p>
                </div>

                {/* Right: Actions */}
                <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (animation.stagger.header + 100) / 1000 }}
                    className="flex items-center gap-3"
                >
                    {/* Notifications */}
                    <button className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-250 group">
                        <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#0B0E14]" />
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                        <div className="text-right">
                            <p className="text-sm font-medium text-white">{userName}</p>
                            <p className="text-xs text-slate-500">Professional</p>
                        </div>

                        <div className="relative group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center cursor-pointer ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 blur-lg opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
                        </div>
                    </div>

                    {/* Logout */}
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-all duration-250 group ml-2"
                        >
                            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                        </button>
                    )}
                </motion.div>
            </div>
        </motion.header>
    );
};
