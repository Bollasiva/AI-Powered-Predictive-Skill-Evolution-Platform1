import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getUserProfile,
  updateUserSkills,
  getMarketRecommendations,
  getCollaborativeRecommendations,
  getCareerPaths,
  uploadResume
} from '../api/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import { MentorBot } from './MentorBot';
import { CardSkeleton } from './Skeleton';

const RecommendationItem = ({ rec }) => {
  const learningLink = rec.resource ? (
    <a
      href={rec.resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="start-learning-link"
    >
      Start Learning on {rec.resource.provider}
    </a>
  ) : null;

  const getBadgeText = () => {
    if (rec.type === 'peer') return 'Popular with your peers';
    if (rec.type === 'improve') return 'Upskill Opportunity';
    if (rec.type === 'prerequisite') return 'Foundational Step';
    if (rec.type === 'discovery') return 'AI Discovery';
    return 'Strategic Goal';
  };

  return (
    <div className={`recommendation-item ${rec.type === 'discovery' ? 'discovery-card' : ''}`}>
      <div className="rec-header">
        <span className="rec-skill-name">{rec.skill}</span>
        <span className={`rec-relevance-score ${rec.type}-badge`}>
          {getBadgeText()}
        </span>
      </div>
      <div className="rec-details">
        {rec.demand_score && <span>Market Demand: {rec.demand_score}</span>}
        {rec.growth_rate && <span>Growth: {rec.growth_rate}%</span>}
        {rec.reason && <p style={{ fontSize: '0.8rem', marginTop: '5px', opacity: 0.8 }}>{rec.reason}</p>}
      </div>
      {rec.unlocks && <div className="rec-unlocks-text">Unlocks your path to {rec.unlocks}</div>}
      {learningLink}
    </div>
  );
};

const SkillProfile = () => {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [newSkill, setNewSkill] = useState({ skillName: '', proficiency: 'Beginner' });
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [careerPaths, setCareerPaths] = useState([]);
  const [careerInterest, setCareerInterest] = useState('');
  const [isBotVisible, setIsBotVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecLoading, setIsRecLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profileRes, careersRes] = await Promise.all([
          getUserProfile(),
          getCareerPaths()
        ]);

        if (profileRes?.data) {
          setUser(profileRes.data);
          setSkills(profileRes.data.skills || []);
          if (careersRes?.data?.length > 0) {
            setCareerPaths(careersRes.data);
            setCareerInterest(careersRes.data[0]);
          }
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Error during initial load:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user || !careerInterest) return;
      setIsRecLoading(true);
      try {
        // Run both fetches, but catch errors individually so one failure doesn't block the other
        const [marketRecsRes, peerRecsRes] = await Promise.all([
          getMarketRecommendations(skills, careerInterest).catch(err => {
            console.warn("Market recommendations failed:", err);
            return { data: [] };
          }),
          getCollaborativeRecommendations().catch(err => {
            console.warn("Collaborative recommendations failed:", err);
            return { data: [] };
          })
        ]);

        const combined = [...(peerRecsRes?.data || []), ...(marketRecsRes?.data || [])];
        setRecommendations(combined);
      } catch (error) {
        console.error('Unexpected error in fetchRecommendations:', error);
      } finally {
        setIsRecLoading(false);
      }
    };
    if (!isLoading) fetchRecommendations();
  }, [skills, careerInterest, user, isLoading]);

  const handleAddSkill = () => {
    if (newSkill.skillName.trim()) {
      setSkills([...skills, newSkill]);
      setNewSkill({ skillName: '', proficiency: 'Beginner' });
    }
  };

  const handleDeleteSkill = (indexToDelete) => {
    setSkills(skills.filter((_, index) => index !== indexToDelete));
  };

  const handleSaveSkills = async () => {
    try {
      await updateUserSkills(skills);
      alert('Profile Updated Successfully!');
    } catch (error) {
      console.error('Failed to save skills', error);
      alert('Could not save skills.');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setIsUploading(true);
    try {
      const res = await uploadResume(formData);
      if (res?.data?.skillsAdded) {
        setSkills(prev => [...prev, ...res.data.skillsAdded]);
        alert('Resume processed! Skills added to your profile.');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      alert('Error processing resume. Make sure the AI Engine is running.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <motion.div className="glass-card" style={{ textAlign: 'center' }}>Loading...</motion.div>;

  return (
    <>
      <motion.div className="glass-card profile-card" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="profile-header">
          <div className="user-greeting">
            <span className="greeting-label">Evolution Platform</span>
            <h2>Welcome back, {user?.name}!</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/dashboard" className="dashboard-link">Analytics</Link>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="logout-button">Logout</motion.button>
          </div>
        </div>

        <div className="dashboard-layout">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="career-interest-section">
              <label htmlFor="career-select">Focus Career</label>
              <select id="career-select" className="career-interest-select" value={careerInterest} onChange={(e) => setCareerInterest(e.target.value)}>
                {careerPaths.map(path => <option key={path} value={path}>{path}</option>)}
              </select>
            </div>

            <div className="profile-actions" style={{ flexDirection: 'column', gap: '15px', marginTop: 0 }}>
              <motion.button onClick={handleSaveSkills} className="save-profile-button" style={{ width: '100%', flex: 'none' }}>Update Profile</motion.button>

              <div className="resume-upload-container" style={{ width: '100%', flex: 'none' }}>
                <label htmlFor="resume-upload" className={`resume-upload-label ${isUploading ? 'loading' : ''}`}>
                  {isUploading ? 'Analyzing...' : 'Sync Resume (AI)'}
                </label>
                <input id="resume-upload" type="file" accept=".pdf,.docx,.doc" onChange={handleResumeUpload} style={{ display: 'none' }} disabled={isUploading} />
              </div>

              <motion.button onClick={() => setAddFormVisible(!isAddFormVisible)} className="add-skill-toggle-button" style={{ width: '100%', flex: 'none' }}>
                {isAddFormVisible ? 'Cancel' : 'Add Skill Manually'}
              </motion.button>

              <AnimatePresence>
                {isAddFormVisible && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <div className="add-skill-form" style={{ flexDirection: 'column', padding: 0, background: 'none' }}>
                      <input type="text" placeholder="Skill Name" value={newSkill.skillName} onChange={e => setNewSkill({ ...newSkill, skillName: e.target.value })} className="form-input" style={{ padding: '12px' }} />
                      <select value={newSkill.proficiency} onChange={e => setNewSkill({ ...newSkill, proficiency: e.target.value })} style={{ padding: '12px', marginTop: '8px' }}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                      </select>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddSkill} className="add-skill-button" style={{ marginTop: '12px', padding: '12px' }}>Add Component</motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            <div className="profile-section">
              <h3>Current Skill Stack</h3>
              <div className="skills-grid">
                <AnimatePresence>
                  {skills.length > 0
                    ? skills.map((skill, index) => (
                      <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} layout className="compact-skill-card">
                        <span className="skill-name">{skill.skillName}</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="skill-proficiency" style={{ fontSize: '0.65rem' }}>{skill.proficiency}</span>
                          <motion.button onClick={() => handleDeleteSkill(index)} className="delete-skill-button" style={{ width: '20px', height: '20px', fontSize: '10px' }}>&#x2715;</motion.button>
                        </div>
                      </motion.div>
                    ))
                    : <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>No skills added yet.</p>}
                </AnimatePresence>
              </div>
            </div>

            <div className="profile-section">
              <h3>Market Opportunities</h3>
              <div className="recommendations-grid">
                <AnimatePresence>
                  {isRecLoading ? (
                    <>
                      <CardSkeleton />
                      <CardSkeleton />
                      <CardSkeleton />
                    </>
                  ) : recommendations.length > 0 ? (
                    recommendations.map((rec, index) => (
                      <motion.div key={`${rec.skill}-${index}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout>
                        <RecommendationItem rec={rec} />
                      </motion.div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>Select a career goal to see recommendations.</p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>{isBotVisible && <MentorBot closeBot={() => setIsBotVisible(false)} />}</AnimatePresence>

      <motion.button className="mentor-bot-fab" onClick={() => setIsBotVisible(!isBotVisible)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Toggle AI Mentor Bot">
        🤖
      </motion.button>
    </>
  );
};

export default SkillProfile;
