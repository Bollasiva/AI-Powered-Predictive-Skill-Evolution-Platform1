import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardData } from "../api/apiService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label" style={{ color: "#e2e8f0", marginBottom: "4px" }}>{`Year: ${label}`}</p>
        <p className="intro" style={{ color: "#fff", fontWeight: "bold" }}>{`Demand Score: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const SkillEvolutionDashboard = () => {
  const [trendData, setTrendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getDashboardData();
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

  const chartData = selectedSkill
    ? [...selectedSkill.history, ...selectedSkill.forecast]
    : [];

  if (isLoading) {
    return (
      <div
        className="glass-card"
        style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}
      >
        Loading Dashboard Data...
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card profile-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="profile-header">
        <h2>Skill Evolution Dashboard</h2>
        <Link to="/profile" className="back-link">
          ← Back to Profile
        </Link>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar for Skill Selection */}
        <div className="profile-sidebar">
          <div className="skill-selector">
            <h3 style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '15px' }}>Top Skills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {trendData.slice(0, 10).map((t) => (
                <motion.button
                  key={t.skill}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedSkill(t)}
                  className={`compact-skill-card ${selectedSkill?.skill === t.skill ? 'active-skill' : ''}`}
                  style={{
                    cursor: 'pointer',
                    textAlign: 'left',
                    background: selectedSkill?.skill === t.skill ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    borderColor: selectedSkill?.skill === t.skill ? 'var(--accent-cyan)' : 'var(--glass-border)'
                  }}
                >
                  <span className="skill-name" style={{ fontSize: '0.85rem' }}>
                    {t.skill.charAt(0).toUpperCase() + t.skill.slice(1)}
                  </span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>
                    Growth: {t.forecast.length > 0 ? 'Projected' : 'Historical Only'}
                  </span>
                </motion.button>
              ))}
              {trendData.length > 10 && (
                <select
                  className="career-interest-select"
                  style={{ marginTop: '10px', padding: '10px', fontSize: '0.8rem' }}
                  onChange={(e) => setSelectedSkill(trendData.find((t) => t.skill === e.target.value))}
                  value={selectedSkill?.skill || ""}
                >
                  <option disabled>More Skills...</option>
                  {trendData.slice(10).map((t) => (
                    <option key={t.skill} value={t.skill}>{t.skill}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="profile-main">

          {trendData.length === 0 && !isLoading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <p>📈 No trend data available yet.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Make sure the AI engine has processed the historical datasets.</p>
            </div>
          )}

          {selectedSkill && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="chart-title">
                Demand for "{selectedSkill.skill}" Over Time
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.1)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }}
                  />
                  <Legend iconType="circle" />

                  {/* Historical Line - Neon Indigo */}
                  <Line
                    type="monotone"
                    dataKey="demand_score"
                    name="Historical Demand"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    data={selectedSkill.history}
                    animationDuration={1500}
                  />

                  {/* Forecast Line - Neon Cyan */}
                  <Line
                    type="monotone"
                    dataKey="demand_score"
                    name="Forecasted Demand"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 6, fill: "#06b6d4", strokeWidth: 0 }}
                    data={selectedSkill.forecast}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillEvolutionDashboard;