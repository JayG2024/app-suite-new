// Team Workload Management and Auto-Assignment System

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  expertise: string[];
  currentWorkload: number; // Number of active projects/leads
  maxCapacity: number; // Maximum concurrent items
  availability: 'available' | 'busy' | 'unavailable';
  lastAssigned?: Date;
  skills: {
    aiProjects: number; // Skill level 1-10
    standardApps: number;
    enterpriseApps: number;
    ecommerce: number;
    saas: number;
    mobile: number;
  };
}

export interface Assignment {
  teamMemberId: number;
  reason: string;
  workloadScore: number;
  expertiseMatch: number;
}

// Default team configuration
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Jason Gordon',
    email: 'jason@jaydus.ai',
    expertise: ['standard', 'enterprise', 'saas', 'leadership'],
    currentWorkload: 0,
    maxCapacity: 15,
    availability: 'available',
    skills: {
      aiProjects: 7,
      standardApps: 10,
      enterpriseApps: 10,
      ecommerce: 9,
      saas: 10,
      mobile: 6
    }
  },
  {
    id: 2,
    name: 'Almir',
    email: 'almir@jaydus.ai',
    expertise: ['ai-enhanced', 'standard', 'technical', 'integrations'],
    currentWorkload: 0,
    maxCapacity: 12,
    availability: 'available',
    skills: {
      aiProjects: 10,
      standardApps: 9,
      enterpriseApps: 8,
      ecommerce: 7,
      saas: 9,
      mobile: 8
    }
  }
];

// Calculate workload score (0-100, where 0 is no load and 100 is at capacity)
export const calculateWorkloadScore = (member: TeamMember): number => {
  if (member.availability === 'unavailable') return 100;
  if (member.currentWorkload >= member.maxCapacity) return 100;
  
  const baseScore = (member.currentWorkload / member.maxCapacity) * 80;
  const busyModifier = member.availability === 'busy' ? 15 : 0;
  
  return Math.min(100, Math.round(baseScore + busyModifier));
};

// Calculate expertise match score for a specific project type
export const calculateExpertiseMatch = (
  member: TeamMember, 
  projectType: string,
  requirements?: string[]
): number => {
  let score = 0;
  
  // Base expertise matching
  if (projectType === 'ai-enhanced' && member.expertise.includes('ai-enhanced')) {
    score += member.skills.aiProjects * 10;
  } else if (projectType === 'enterprise' && member.expertise.includes('enterprise')) {
    score += member.skills.enterpriseApps * 10;
  } else if (projectType === 'standard' && member.expertise.includes('standard')) {
    score += member.skills.standardApps * 10;
  }
  
  // Additional requirements matching
  if (requirements) {
    requirements.forEach(req => {
      const reqLower = req.toLowerCase();
      if (reqLower.includes('ecommerce') || reqLower.includes('e-commerce')) {
        score += member.skills.ecommerce * 2;
      }
      if (reqLower.includes('saas') || reqLower.includes('subscription')) {
        score += member.skills.saas * 2;
      }
      if (reqLower.includes('mobile') || reqLower.includes('app')) {
        score += member.skills.mobile * 2;
      }
      if (reqLower.includes('ai') || reqLower.includes('machine learning')) {
        score += member.skills.aiProjects * 3;
      }
    });
  }
  
  return Math.min(100, score);
};

// Auto-assign team member based on workload and expertise
export const autoAssignTeamMember = (
  projectType: 'standard' | 'ai-enhanced' | 'enterprise',
  requirements?: string[],
  teamMembers: TeamMember[] = TEAM_MEMBERS
): Assignment | null => {
  // Filter available team members
  const availableMembers = teamMembers.filter(
    member => member.availability !== 'unavailable' && 
    member.currentWorkload < member.maxCapacity
  );
  
  if (availableMembers.length === 0) {
    return null;
  }
  
  // Calculate scores for each available member
  const scoredMembers = availableMembers.map(member => {
    const workloadScore = calculateWorkloadScore(member);
    const expertiseMatch = calculateExpertiseMatch(member, projectType, requirements);
    
    // Combined score (lower workload is better, higher expertise is better)
    const combinedScore = expertiseMatch * 2 - workloadScore;
    
    return {
      member,
      workloadScore,
      expertiseMatch,
      combinedScore
    };
  });
  
  // Sort by combined score (highest is best)
  scoredMembers.sort((a, b) => b.combinedScore - a.combinedScore);
  
  const selected = scoredMembers[0];
  
  // If expertise match is too low, prefer round-robin assignment
  if (selected.expertiseMatch < 30) {
    // Find member with lowest workload for round-robin
    const lowestWorkload = availableMembers.reduce((prev, current) => 
      calculateWorkloadScore(current) < calculateWorkloadScore(prev) ? current : prev
    );
    
    return {
      teamMemberId: lowestWorkload.id,
      reason: `Round-robin assignment (lowest workload)`,
      workloadScore: calculateWorkloadScore(lowestWorkload),
      expertiseMatch: calculateExpertiseMatch(lowestWorkload, projectType, requirements)
    };
  }
  
  return {
    teamMemberId: selected.member.id,
    reason: `Best match: ${selected.expertiseMatch}% expertise, ${100 - selected.workloadScore}% capacity`,
    workloadScore: selected.workloadScore,
    expertiseMatch: selected.expertiseMatch
  };
};

// Update team member workload
export const updateTeamWorkload = async (
  teamMemberId: number,
  delta: number
): Promise<void> => {
  try {
    // This would typically update the database
    // For now, we'll update the local state
    const member = TEAM_MEMBERS.find(m => m.id === teamMemberId);
    if (member) {
      member.currentWorkload = Math.max(0, member.currentWorkload + delta);
      member.lastAssigned = new Date();
      
      // Update availability based on workload
      const workloadPercentage = (member.currentWorkload / member.maxCapacity) * 100;
      if (workloadPercentage >= 90) {
        member.availability = 'unavailable';
      } else if (workloadPercentage >= 70) {
        member.availability = 'busy';
      } else {
        member.availability = 'available';
      }
    }
  } catch (error) {
    console.error('Failed to update team workload:', error);
  }
};

// Get workload summary for dashboard
export const getWorkloadSummary = (teamMembers: TeamMember[] = TEAM_MEMBERS) => {
  return teamMembers.map(member => ({
    id: member.id,
    name: member.name,
    currentWorkload: member.currentWorkload,
    maxCapacity: member.maxCapacity,
    workloadPercentage: Math.round((member.currentWorkload / member.maxCapacity) * 100),
    availability: member.availability,
    workloadScore: calculateWorkloadScore(member)
  }));
};

// Smart assignment recommendations
export const getAssignmentRecommendations = (
  projectType: string,
  requirements: string[] = []
): Assignment[] => {
  return TEAM_MEMBERS
    .filter(member => member.availability !== 'unavailable')
    .map(member => ({
      teamMemberId: member.id,
      reason: generateAssignmentReason(member, projectType, requirements),
      workloadScore: calculateWorkloadScore(member),
      expertiseMatch: calculateExpertiseMatch(member, projectType, requirements)
    }))
    .sort((a, b) => {
      // Sort by combined score
      const scoreA = a.expertiseMatch * 2 - a.workloadScore;
      const scoreB = b.expertiseMatch * 2 - b.workloadScore;
      return scoreB - scoreA;
    });
};

// Generate human-readable assignment reason
const generateAssignmentReason = (
  member: TeamMember,
  projectType: string,
  requirements: string[]
): string => {
  const reasons: string[] = [];
  
  if (projectType === 'ai-enhanced' && member.skills.aiProjects >= 9) {
    reasons.push('AI expertise');
  }
  if (projectType === 'enterprise' && member.skills.enterpriseApps >= 9) {
    reasons.push('Enterprise experience');
  }
  
  const workloadPercentage = Math.round((member.currentWorkload / member.maxCapacity) * 100);
  if (workloadPercentage < 50) {
    reasons.push('Good availability');
  }
  
  if (requirements.some(req => req.toLowerCase().includes('urgent')) && workloadPercentage < 30) {
    reasons.push('Available for urgent work');
  }
  
  return reasons.length > 0 ? reasons.join(', ') : 'Available for assignment';
};

// Export workload data for analytics
export const exportWorkloadAnalytics = () => {
  const summary = getWorkloadSummary();
  const totalCapacity = TEAM_MEMBERS.reduce((sum, member) => sum + member.maxCapacity, 0);
  const totalWorkload = TEAM_MEMBERS.reduce((sum, member) => sum + member.currentWorkload, 0);
  
  return {
    timestamp: new Date().toISOString(),
    teamSize: TEAM_MEMBERS.length,
    totalCapacity,
    totalWorkload,
    utilizationRate: Math.round((totalWorkload / totalCapacity) * 100),
    memberStats: summary,
    availableCapacity: totalCapacity - totalWorkload,
    recommendations: {
      needsHiring: totalWorkload / totalCapacity > 0.85,
      canTakeMore: totalWorkload / totalCapacity < 0.7
    }
  };
};