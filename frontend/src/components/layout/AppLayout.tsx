import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MentorBot } from '../chat/MentorBot';

interface AppLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    userName?: string;
    onLogout?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    title,
    subtitle,
    userName,
    onLogout
}) => {
    return (
        <div className="min-h-screen bg-[#0B0E14] relative overflow-hidden">
            {/* Background gradient glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="ml-20 min-h-screen flex flex-col">
                <Header
                    title={title}
                    subtitle={subtitle}
                    userName={userName}
                    onLogout={onLogout}
                />

                {/* Content with 12-column grid */}
                <main className="flex-1 relative">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="container mx-auto px-8 py-8 max-w-[1600px]"
                    >
                        {/* 12-column grid wrapper */}
                        <div className="grid grid-cols-12 gap-6">
                            {children}
                        </div>
                    </motion.div>
                </main>
            </div>

            {/* Noise texture overlay for depth */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* AI Mentor Bot */}
            <MentorBot />
        </div>
    );
};
