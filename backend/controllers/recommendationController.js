const User = require('../models/user'); // Standardized lowercase casing
const Trend = require('../models/Trend');
const resourceMap = require('../data/resourceMap');
const careerPaths = require('../data/careerPaths');
const SKILL_PREREQUISITES = require('../data/skillPrerequisites');

const PROFICIENCY_WEIGHTS = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };

const calculateWeightedSimilarity = (currentSkills, otherSkills) => {
  const currentMap = new Map(currentSkills.map(s => [s.skillName.toLowerCase(), PROFICIENCY_WEIGHTS[s.proficiency]]));
  const otherMap = new Map(otherSkills.map(s => [s.skillName.toLowerCase(), PROFICIENCY_WEIGHTS[s.proficiency]]));
  let intersection = 0, union = 0;
  const allSkills = new Set([...currentMap.keys(), ...otherMap.keys()]);
  for (const skill of allSkills) {
    const a = currentMap.get(skill) || 0;
    const b = otherMap.get(skill) || 0;
    intersection += Math.min(a, b);
    union += Math.max(a, b);
  }
  return union ? intersection / union : 0;
};

exports.getMarketRecommendations = async (req, res) => {
  try {
    const { skills: userSkills, careerInterest } = req.body;

    // Safety check
    if (!userSkills || !careerInterest) {
      return res.status(400).json({ msg: "Missing skills or career interest" });
    }

    const userSkillSet = new Set(userSkills.map(s => s.skillName.toLowerCase()));
    const requiredSkills = careerPaths[careerInterest];
    if (!requiredSkills) return res.status(404).json({ msg: 'Career path not found.' });

    const trendsData = await Trend.findById('skill_historical_trends') || { trends: [] };

    const trendsMap = new Map(trendsData.trends.map(s => [s.skill.toLowerCase(), s]));
    const recommendationsMap = new Map();

    // --- New / Prerequisite Recommendations ---
    for (const skill of requiredSkills) {
      if (userSkillSet.has(skill.toLowerCase())) continue;

      const trend = trendsMap.get(skill.toLowerCase());
      let growth = 0;
      let demand = 0;
      let relevance = 50; // Default relevance

      if (trend && trend.history.length >= 2) {
        const [prev, curr] = trend.history.slice(-2);
        growth = ((curr.demand_score - prev.demand_score) / prev.demand_score) * 100;
        demand = curr.demand_score;
        relevance = parseFloat(((curr.demand_score * 0.4) + (growth * 0.6)).toFixed(2));
      } else if (trend && trend.history.length === 1) {
        demand = trend.history[0].demand_score;
        relevance = parseFloat((demand * 0.5 + 40).toFixed(2));
      }

      const prerequisites = SKILL_PREREQUISITES[skill.toLowerCase()] || [];
      const missingPrereq = prerequisites.find(pr => !userSkillSet.has(pr));

      if (missingPrereq) {
        if (!recommendationsMap.has(missingPrereq) || relevance > (recommendationsMap.get(missingPrereq).relevance_score || 0)) {
          recommendationsMap.set(missingPrereq, {
            skill: missingPrereq,
            type: 'prerequisite',
            unlocks: skill,
            relevance_score: relevance
          });
        }
      } else {
        recommendationsMap.set(skill, {
          skill,
          type: 'new',
          demand_score: demand || 'N/A',
          growth_rate: growth ? parseFloat(growth.toFixed(2)) : 'Stable',
          relevance_score: relevance
        });
      }
    }

    // --- Improve Existing Skills ---
    for (const skillObj of userSkills) {
      const skillName = skillObj.skillName.toLowerCase();
      if (skillObj.proficiency === 'Expert') continue;

      const trend = trendsMap.get(skillName);
      let relevance = 30; // Default if not in career path

      // Higher relevance if it's actually in your career path
      if (requiredSkills.some(s => s.toLowerCase() === skillName)) relevance += 30;

      let growth = 0;
      let demand = 0;

      if (trend && trend.history.length >= 2) {
        const [prev, curr] = trend.history.slice(-2);
        growth = ((curr.demand_score - prev.demand_score) / prev.demand_score) * 100;
        demand = curr.demand_score;
        relevance = parseFloat(((curr.demand_score * 0.4) + (growth * 0.6) + relevance).toFixed(2));
      }

      recommendationsMap.set(skillName + '_improve', {
        skill: skillObj.skillName,
        type: 'improve',
        demand_score: demand || 'N/A',
        growth_rate: growth ? parseFloat(growth.toFixed(2)) : 'N/A',
        relevance_score: relevance
      });
    }

    // --- Discover Related Skills (Semantic Expansion) ---
    try {
      if (userSkills && userSkills.length > 0) {
        const { getSemanticSkills } = require('../services/aiService');
        const randomSkill = userSkills[Math.floor(Math.random() * userSkills.length)].skillName;
        const related = await getSemanticSkills(randomSkill);

        if (related && Array.isArray(related)) {
          related.forEach(skill => {
            const key = skill.toLowerCase();
            if (!userSkillSet.has(key) && !recommendationsMap.has(key)) {
              recommendationsMap.set(key + '_discovery', {
                skill,
                type: 'discovery',
                reason: `Expand your horizon from ${randomSkill}`,
                relevance_score: 65
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn("Semantic discovery failed:", e.message);
    }

    const finalRecs = Array.from(recommendationsMap.values())
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .map(rec => ({ ...rec, resource: resourceMap[rec.skill.toLowerCase()] || null }))
      .slice(0, 6);

    res.json(finalRecs);

  } catch (err) {
    console.error("Market Rec Error:", err);
    res.status(500).send('Server Error');
  }
};

exports.getCollaborativeRecommendations = async (req, res) => {
  try {
    // FIX: Safety Check for Auth to prevent crash
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const currentUser = await User.findById(req.user.id).select('skills');
    if (!currentUser) return res.status(404).json({ msg: "User not found" });

    // Only sample top 100 users for performance
    const otherUsers = await User.find({ _id: { $ne: req.user.id } }).select('skills').limit(100);
    const currentSkillSet = new Set(currentUser.skills.map(s => s.skillName.toLowerCase()));

    const scoredSkills = {};
    otherUsers.forEach(user => {
      const sim = calculateWeightedSimilarity(currentUser.skills, user.skills);
      if (sim === 0) return;
      user.skills.forEach(s => {
        const skill = s.skillName.toLowerCase();
        if (!currentSkillSet.has(skill)) scoredSkills[skill] = (scoredSkills[skill] || 0) + sim;
      });
    });

    const recs = Object.entries(scoredSkills)
      .map(([skill, score]) => ({ skill, score: parseFloat(score.toFixed(2)), type: 'peer', resource: resourceMap[skill] || null }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json(recs);

  } catch (err) {
    console.error("Collab Rec Error:", err);
    res.status(500).send('Server Error');
  }
};