import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Code2, Database, Cloud, Brain, Cpu, Globe,
    Palette, Terminal, Smartphone, Lock, X
} from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';

interface SkillCardProps {
    skillName: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    onDelete?: () => void;
    index?: number;
}

// Icon mapping for common skills
const getSkillIcon = (skillName: string) => {
    const name = skillName.toLowerCase();
    if (name.includes('python') || name.includes('javascript') || name.includes('java')) return Code2;
    if (name.includes('sql') || name.includes('database') || name.includes('mongo')) return Database;
    if (name.includes('aws') || name.includes('cloud') || name.includes('azure')) return Cloud;
    if (name.includes('ai') || name.includes('ml') || name.includes('learning')) return Brain;
    if (name.includes('react') || name.includes('vue') || name.includes('angular')) return Cpu;
    if (name.includes('web') || name.includes('http') || name.includes('api')) return Globe;
    if (name.includes('design') || name.includes('ui') || name.includes('ux')) return Palette;
    if (name.includes('docker') || name.includes('kubernetes') || name.includes('devops')) return Terminal;
    if (name.includes('mobile') || name.includes('ios') || name.includes('android')) return Smartphone;
    if (name.includes('security') || name.includes('auth')) return Lock;
    return Code2; // default
};

const getProficiencyLevel = (proficiency: string): number => {
    const levels = {
        'Beginner': 25,
        'Intermediate': 50,
        'Advanced': 75,
        'Expert': 100,
    };
    return levels[proficiency as keyof typeof levels] || 25;
};

const getProficiencyColor = (proficiency: string): string => {
    const colors = {
        'Beginner': 'from-slate-500 to-slate-600',
        'Intermediate': 'from-blue-500 to-blue-600',
        'Advanced': 'from-violet-500 to-violet-600',
        'Expert': 'from-emerald-500 to-emerald-600',
    };
    return colors[proficiency as keyof typeof colors] || 'from-slate-500 to-slate-600';
};

export const SkillCard: React.FC<SkillCardProps> = ({
    skillName,
    proficiency,
    onDelete,
    index = 0
}) => {
    const Icon = getSkillIcon(skillName);
    const level = getProficiencyLevel(proficiency);
    const [progress, setProgress] = useState(0);

    // Animate progress on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(level);
        }, 300 + (index * 50)); // Stagger animation
        return () => clearTimeout(timer);
    }, [level, index]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -100 }}
            transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0, 0, 0.2, 1]
            }}
            whileHover={{
                y: -4,
                transition: { duration: 0.2 }
            }}
            className="group relative"
        >
            {/* Glass card */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-white/5 p-5 transition-all duration-300 group-hover:border-white/10 group-hover:bg-slate-900/60">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/5 group-hover:to-violet-500/5 transition-all duration-500" />

                {/* Content */}
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Icon with scale animation */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getProficiencyColor(proficiency)} flex items-center justify-center shadow-lg`}
                            >
                                <Icon className="w-6 h-6 text-white" />
                            </motion.div>

                            <div>
                                <h3 className="font-semibold text-white text-base group-hover:text-blue-300 transition-colors">
                                    {skillName}
                                </h3>
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                                    {proficiency}
                                </span>
                            </div>
                        </div>

                        {/* Delete button */}
                        {onDelete && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onDelete}
                                className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                            >
                                <X className="w-4 h-4 text-red-400" />
                            </motion.button>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Proficiency</span>
                            <span className="text-slate-400 font-mono">{progress}%</span>
                        </div>

                        <Progress.Root
                            className="relative h-2 w-full overflow-hidden rounded-full bg-white/5"
                            value={progress}
                        >
                            <Progress.Indicator
                                className={`h-full bg-gradient-to-r ${getProficiencyColor(proficiency)} transition-all duration-1000 ease-out relative`}
                                style={{
                                    transform: `translateX(-${100 - progress}%)`,
                                }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                            </Progress.Indicator>
                        </Progress.Root>
                    </div>
                </div>

                {/* Subtle glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getProficiencyColor(proficiency)} opacity-5 blur-xl`} />
                </div>
            </div>
        </motion.div>
    );
};

// Shimmer animation for progress bar
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;
document.head.appendChild(style);
