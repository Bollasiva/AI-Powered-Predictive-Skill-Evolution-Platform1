import React, { useState } from 'react';
import { login, register } from '../api/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { IconType } from 'react-icons';

// Fix for React 19 / react-icons type incompatibility
const IconWrapper = ({ icon, className }: { icon: IconType, className?: string }) => {
    const IconComponent = icon as any;
    return <IconComponent className={className} />;
};

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = isLogin
                ? await login({ email: formData.email, password: formData.password })
                : await register(formData);

            if (data.token) {
                localStorage.setItem('token', data.token);
                // Add a small delay for the animation to complete
                setTimeout(() => {
                    window.location.href = '/profile';
                }, 500);
            }
        } catch (error: any) {
            console.error('Authentication error:', error.response?.data || error.message);
            alert(error.response?.data?.msg || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[128px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[128px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

            <motion.div
                className="glass-card auth-card relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
                {/* Decorative Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />

                <div className="relative z-10 flex flex-col items-center">
                    <motion.h2
                        key={isLogin ? 'login' : 'register'}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
                    >
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </motion.h2>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="name-input"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="relative group"
                                >
                                    <IconWrapper icon={FiUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:bg-slate-900/80 transition-all"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative group">
                            <IconWrapper icon={FiMail} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:bg-slate-900/80 transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <IconWrapper icon={FiLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-12 py-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:bg-slate-900/80 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none"
                            >
                                <IconWrapper icon={showPassword ? FiEyeOff : FiEye} />
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group relative overflow-hidden"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Get Started'}</span>
                                    <IconWrapper icon={FiArrowRight} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}

                            {/* Shine effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 transition-transform bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </motion.button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
                        <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors hover:underline underline-offset-4"
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;