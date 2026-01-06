import React, { useState, useEffect } from 'react';
import {
  getUserProfile,
  updateUserSkills,
  getMarketRecommendations,
  getCollaborativeRecommendations,
  getCareerPaths,
  uploadResume
} from '../api/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from './layout/AppLayout';
import { HeroCard } from './dashboard/HeroCard';
import { SkillCard } from './skills/SkillCard';
import { OpportunityCard } from './insights/OpportunityCard';
import { Plus, Upload, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface Skill {
  skillName: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface Recommendation {
  skill: string;
  type: 'peer' | 'improve' | 'prerequisite' | 'discovery' | 'new';
  resource?: { url: string; provider: string };
  demand_score?: number | string;
  growth_rate?: number | string;
  reason?: string;
}

const SkillProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [newSkill, setNewSkill] = useState<Skill>({ skillName: '', proficiency: 'Beginner' });
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [careerPaths, setCareerPaths] = useState<string[]>([]);
  const [careerInterest, setCareerInterest] = useState('');
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
          if (careersRes?.data && Object.keys(careersRes.data).length > 0) {
            const paths = careersRes.data;
            setCareerPaths(paths);
            setCareerInterest(paths[0]);
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
        const [marketRecsRes, peerRecsRes] = await Promise.all([
          getMarketRecommendations(skills, careerInterest).catch(() => ({ data: [] })),
          getCollaborativeRecommendations().catch(() => ({ data: [] }))
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
      setAddFormVisible(false);
    }
  };

  const handleDeleteSkill = (indexToDelete: number) => {
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

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your evolution...</p>
        </div>
      </div>
    );
  }

  const completionPercentage = Math.min(Math.round((skills.length / 15) * 100), 100);

  return (
    <AppLayout
      title="Skill Evolution"
      subtitle="AI-powered insights for your career growth"
      userName={user?.name}
      onLogout={handleLogout}
    >
      {/* Hero Section */}
      <HeroCard
        skillCount={skills.length}
        completionPercentage={completionPercentage}
      />

      {/* Skills Section */}
      <div className="col-span-12 lg:col-span-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Skill Stack</h2>
              <p className="text-sm text-slate-500 mt-1">Build your competitive advantage</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setAddFormVisible(!isAddFormVisible)}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/30 transition-all duration-250">
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Analyzing...' : 'Upload Resume'}
                </div>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleResumeUpload}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Add Skill Form */}
          <AnimatePresence>
            {isAddFormVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <Card className="bg-slate-900/40 border-slate-800 p-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Skill name (e.g., Python, React)"
                      value={newSkill.skillName}
                      onChange={e => setNewSkill({ ...newSkill, skillName: e.target.value })}
                      className="flex-1"
                    />
                    <select
                      value={newSkill.proficiency}
                      onChange={e => setNewSkill({ ...newSkill, proficiency: e.target.value as any })}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                    <Button onClick={handleAddSkill}>Add</Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <SkillCard
                    key={`${skill.skillName}-${index}`}
                    skillName={skill.skillName}
                    proficiency={skill.proficiency}
                    onDelete={() => handleDeleteSkill(index)}
                    index={index}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-2 text-center py-12 text-slate-500"
                >
                  <p>No skills added yet. Start building your profile!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6">
            <Button onClick={handleSaveSkills} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Career Focus Sidebar */}
      <div className="col-span-12 lg:col-span-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky top-24"
        >
          <Card className="bg-slate-900/40 border-slate-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Career Focus</h3>
            <select
              value={careerInterest}
              onChange={(e) => setCareerInterest(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              {careerPaths.map(path => <option key={path} value={path}>{path}</option>)}
            </select>
          </Card>
        </motion.div>
      </div>

      {/* Market Opportunities */}
      <div className="col-span-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Market Opportunities</h2>
            <p className="text-sm text-slate-500 mt-1">AI-curated skills for your career trajectory</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {isRecLoading ? (
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
                  ))}
                </>
              ) : recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <OpportunityCard
                    key={`${rec.skill}-${index}`}
                    {...rec}
                    index={index}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-slate-500">
                  <p>Select a career focus to see personalized recommendations</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default SkillProfile;
