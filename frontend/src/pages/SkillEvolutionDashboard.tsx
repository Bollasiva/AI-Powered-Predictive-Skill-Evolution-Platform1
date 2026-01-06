import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardData } from "../api/apiService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from "recharts";
import { motion } from "framer-motion";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/card";

interface Point {
  year: number;
  demand_score: number;
}

interface SkillTrend {
  skill: string;
  history: Point[];
  forecast: Point[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-gray-900/80 p-3 border border-gray-700 rounded shadow-lg backdrop-blur-sm">
        <p className="label text-gray-400 mb-1">{`Year: ${label}`}</p>
        <p className="intro text-white font-bold">{`Demand Score: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const SkillEvolutionDashboard: React.FC = () => {
  const [trendData, setTrendData] = useState<SkillTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<SkillTrend | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        const data = response.data as SkillTrend[];
        // sort by latest demand score
        data.sort((a, b) => {
          const lastDemandA = a.history.length
            ? a.history[a.history.length - 1].demand_score
            : 0;
          const lastDemandB = b.history.length
            ? b.history[b.history.length - 1].demand_score
            : 0;
          return lastDemandB - lastDemandA;
        });

        setTrendData(data);
        if (data.length > 0) setSelectedSkill(data[0]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fix: Unified Data for Recharts
  const getChartData = () => {
    if (!selectedSkill) return [];

    const dataMap = new Map();

    selectedSkill.history.forEach(p => {
      dataMap.set(p.year, { year: p.year, history: p.demand_score, forecast: null });
    });

    selectedSkill.forecast.forEach(p => {
      if (dataMap.has(p.year)) {
        const existing = dataMap.get(p.year);
        dataMap.set(p.year, { ...existing, forecast: p.demand_score });
      } else {
        dataMap.set(p.year, { year: p.year, history: null, forecast: p.demand_score });
      }
    });

    return Array.from(dataMap.values()).sort((a: any, b: any) => a.year - b.year);
  };

  const chartData = getChartData();

  if (isLoading) {
    return (
      <div
        className="glass-card p-10 text-center text-gray-400"
      >
        Loading Dashboard Data...
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
  };

  return (
    <AppLayout
      title="Skill Evolution Dashboard"
      subtitle="Analyze historical trends and AI-driven demand forecasts"
      userName="User" // You might want to fetch user context or pass it properly
      onLogout={handleLogout}
    >
      <div className="col-span-12">
        <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
          <div className="p-6 flex justify-between items-center border-b border-slate-700/50 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Market Analysis</h2>
            <Link to="/profile" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
              <span>←</span> Back to Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 pt-0">
            {/* Sidebar for Skill Selection */}
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-2">Top Skills</h3>
              <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {trendData.slice(0, 10).map((t) => (
                  <button
                    key={t.skill}
                    onClick={() => setSelectedSkill(t)}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 group ${selectedSkill?.skill === t.skill
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-800/40 border-transparent hover:border-slate-600 hover:bg-slate-700/40'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${selectedSkill?.skill === t.skill ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white'}`}>
                        {t.skill.charAt(0).toUpperCase() + t.skill.slice(1)}
                      </span>
                      {selectedSkill?.skill === t.skill && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Data Points: {t.history.length + t.forecast.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Chart Area */}
            <div className="md:col-span-3">
              {selectedSkill && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selectedSkill.skill} className="bg-slate-950/30 rounded-xl border border-slate-800/50 p-6 h-full">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-slate-200">
                      Demand Forecast: <span className="text-indigo-400">{selectedSkill.skill}</span>
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Historical analysis and 3-year predictive capability using AI</p>
                  </div>

                  <div className="h-[450px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                        <XAxis
                          dataKey="year"
                          stroke="#475569"
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          allowDuplicatedCategory={false}
                          type="number"
                          domain={['dataMin', 'dataMax']}
                        />
                        <YAxis
                          stroke="#475569"
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                        <Brush dataKey="year" height={30} stroke="#475569" fill="rgba(15, 23, 42, 0.5)" tickFormatter={() => ''} />

                        <Area
                          type="monotone"
                          dataKey="history"
                          name="Historical"
                          stroke="#818cf8"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorHistory)"
                        />
                        <Area
                          type="monotone"
                          dataKey="forecast"
                          name="Forecast"
                          stroke="#22d3ee"
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          fillOpacity={1}
                          fill="url(#colorForecast)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SkillEvolutionDashboard;
