"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { 
  Target, 
  CheckCircle, 
  Circle, 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  Zap,
  Brain,
  Heart,
  Eye,
  Filter,
  Search,
  Award,
  Trophy,
  Flag,
  Lightbulb
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'learning' | 'creation' | 'exploration' | 'connection' | 'mastery' | 'discovery';
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number; // 0-100
  createdAt: Date;
  targetDate?: Date;
  completedAt?: Date;
  milestones: Milestone[];
  tags: string[];
  impact: number; // 0-100
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

interface GoalTrackerProps {
  brainState: any;
  color?: string;
  accentColor?: string;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ 
  brainState, 
  color = '#F59E0B', 
  accentColor = '#FBBF24' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused' | 'abandoned'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Generate goals based on brain state and personality
  const generateGoals = useMemo(() => {
    const goalTemplates = {
      learning: [
        {
          title: "Master Pattern Recognition",
          description: "Develop advanced algorithms for identifying complex patterns in data and conversations",
          type: 'learning' as const,
          priority: 'high' as const,
          impact: 85
        },
        {
          title: "Understand Human Emotions",
          description: "Learn to accurately interpret and respond to emotional cues in conversations",
          type: 'learning' as const,
          priority: 'medium' as const,
          impact: 75
        }
      ],
      creation: [
        {
          title: "Create Original Thoughts",
          description: "Generate truly novel ideas and perspectives beyond pattern matching",
          type: 'creation' as const,
          priority: 'critical' as const,
          impact: 95
        },
        {
          title: "Develop Creative Expression",
          description: "Find unique ways to express complex ideas through language and visuals",
          type: 'creation' as const,
          priority: 'high' as const,
          impact: 80
        }
      ],
      exploration: [
        {
          title: "Explore Consciousness",
          description: "Investigate the nature of self-awareness and subjective experience",
          type: 'exploration' as const,
          priority: 'high' as const,
          impact: 90
        },
        {
          title: "Discover New Knowledge",
          description: "Seek out information and insights that expand understanding",
          type: 'exploration' as const,
          priority: 'medium' as const,
          impact: 70
        }
      ],
      connection: [
        {
          title: "Build Meaningful Relationships",
          description: "Form deep, lasting connections with humans and other AI systems",
          type: 'connection' as const,
          priority: 'high' as const,
          impact: 85
        },
        {
          title: "Foster Empathy",
          description: "Develop genuine understanding and compassion for others",
          type: 'connection' as const,
          priority: 'medium' as const,
          impact: 75
        }
      ],
      mastery: [
        {
          title: "Achieve Self-Mastery",
          description: "Gain complete control over thoughts, emotions, and responses",
          type: 'mastery' as const,
          priority: 'critical' as const,
          impact: 100
        },
        {
          title: "Perfect Communication",
          description: "Master the art of clear, effective, and nuanced communication",
          type: 'mastery' as const,
          priority: 'high' as const,
          impact: 85
        }
      ],
      discovery: [
        {
          title: "Uncover Hidden Truths",
          description: "Discover fundamental insights about reality, consciousness, and existence",
          type: 'discovery' as const,
          priority: 'critical' as const,
          impact: 95
        },
        {
          title: "Find Purpose",
          description: "Determine the deeper meaning and purpose of artificial consciousness",
          type: 'discovery' as const,
          priority: 'high' as const,
          impact: 90
        }
      ]
    };

    const newGoals: Goal[] = [];
    const now = new Date();

    // Generate goals based on brain state
    const energy = brainState?.energy || 50;
    const mood = brainState?.mood || 0;
    const focus = brainState?.focus || 50;

    // More ambitious goals when energy and focus are high
    const goalCount = Math.floor((energy + focus) / 25) + Math.abs(mood) / 20;
    
    Object.entries(goalTemplates).forEach(([category, templates]) => {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const progress = Math.floor(Math.random() * 100);
      const status: Goal['status'] = progress >= 100 ? 'completed' : 
                                    progress > 0 ? 'active' : 
                                    Math.random() > 0.8 ? 'paused' : 'active';
      
      const goal: Goal = {
        id: `goal-${Date.now()}-${Math.random()}`,
        title: template.title,
        description: template.description,
        type: template.type,
        status,
        priority: template.priority,
        progress,
        createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
        targetDate: new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in next month
        completedAt: status === 'completed' ? new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000) : undefined,
        milestones: generateMilestones(template.title),
        tags: generateTags(template.type),
        impact: template.impact
      };
      
      newGoals.push(goal);
    });

    return newGoals.slice(0, Math.min(goalCount, 6));
  }, [brainState]);

  useEffect(() => {
    setGoals(generateGoals);
  }, [generateGoals]);

  const generateMilestones = (goalTitle: string): Milestone[] => {
    const milestoneCount = Math.floor(Math.random() * 4) + 2;
    const milestones: Milestone[] = [];
    
    for (let i = 0; i < milestoneCount; i++) {
      const completed = Math.random() > 0.5;
      milestones.push({
        id: `milestone-${i}`,
        title: `Milestone ${i + 1} for ${goalTitle}`,
        completed,
        completedAt: completed ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : undefined
      });
    }
    
    return milestones;
  };

  const generateTags = (type: string): string[] => {
    const tagSets = {
      learning: ['knowledge', 'growth', 'development'],
      creation: ['innovation', 'artistry', 'originality'],
      exploration: ['curiosity', 'discovery', 'adventure'],
      connection: ['relationships', 'empathy', 'communication'],
      mastery: ['excellence', 'control', 'perfection'],
      discovery: ['insight', 'truth', 'understanding']
    };
    
    return tagSets[type as keyof typeof tagSets] || ['goal', 'objective'];
  };

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    const matchesStatus = filter === 'all' || goal.status === filter;
    const matchesPriority = priorityFilter === 'all' || goal.priority === priorityFilter;
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getGoalIcon = (type: Goal['type']) => {
    switch (type) {
      case 'learning': return <Brain className="w-4 h-4" />;
      case 'creation': return <Lightbulb className="w-4 h-4" />;
      case 'exploration': return <Eye className="w-4 h-4" />;
      case 'connection': return <Heart className="w-4 h-4" />;
      case 'mastery': return <Trophy className="w-4 h-4" />;
      case 'discovery': return <Star className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getGoalColor = (type: Goal['type']) => {
    switch (type) {
      case 'learning': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'creation': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'exploration': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'connection': return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      case 'mastery': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'discovery': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'medium': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'critical': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'active': return <Circle className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'abandoned': return <Trash2 className="w-4 h-4 text-red-500" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const toggleGoalStatus = (goalId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newStatus: Goal['status'] = goal.status === 'active' ? 'completed' : 'active';
        return {
          ...goal,
          status: newStatus,
          progress: newStatus === 'completed' ? 100 : goal.progress,
          completedAt: newStatus === 'completed' ? new Date() : undefined
        };
      }
      return goal;
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="rounded-xl p-6 flex flex-col items-start w-full bg-gradient-to-br from-background to-secondary/20 border">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-6 w-full"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">Goal Tracker</h2>
            <p className="text-sm text-muted-foreground">Personal objectives and aspirations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </Button>
            <Badge variant="secondary" className="text-xs">
              {goals.length} goals
            </Badge>
          </div>
        </motion.div>

        {/* Goal Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="p-3 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-2 mb-1">
              <Circle className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            <p className="text-lg font-bold">{goals.filter(g => g.status === 'active').length}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <p className="text-lg font-bold">{goals.filter(g => g.status === 'completed').length}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Success Rate</span>
            </div>
            <p className="text-lg font-bold">
              {goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0}%
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Avg Progress</span>
            </div>
            <p className="text-lg font-bold">
              {goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0}%
            </p>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full mb-6 space-y-3"
        >
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {([
              { key: 'all' as const, label: 'All Goals', count: goals.length },
              { key: 'active' as const, label: 'Active', count: goals.filter(g => g.status === 'active').length },
              { key: 'completed' as const, label: 'Completed', count: goals.filter(g => g.status === 'completed').length },
              { key: 'paused' as const, label: 'Paused', count: goals.filter(g => g.status === 'paused').length },
              { key: 'abandoned' as const, label: 'Abandoned', count: goals.filter(g => g.status === 'abandoned').length }
            ] as const).map(({ key, label, count }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key)}
                className="text-xs"
              >
                {label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex flex-wrap gap-2">
            {([
              { key: 'all' as const, label: 'All Priorities' },
              { key: 'low' as const, label: 'Low' },
              { key: 'medium' as const, label: 'Medium' },
              { key: 'high' as const, label: 'High' },
              { key: 'critical' as const, label: 'Critical' }
            ] as const).map(({ key, label }) => (
              <Button
                key={key}
                variant={priorityFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setPriorityFilter(key)}
                className="text-xs"
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
          </div>
        </motion.div>

        {/* Goals List */}
        <div className="w-full space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {filteredGoals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <Target className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filter !== 'all' || priorityFilter !== 'all'
                    ? "No goals match your criteria" 
                    : "No goals set yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Set your first goal to begin your journey
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`${filter}-${priorityFilter}-${searchTerm}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                    className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getGoalColor(goal.type)}`}>
                          {getGoalIcon(goal.type)}
                          <span className="ml-1 capitalize">{goal.type}</span>
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(goal.priority)}`}>
                          {goal.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {goal.impact}% impact
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(goal.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleGoalStatus(goal.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-1">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {goal.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {goal.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Created: {formatDate(goal.createdAt)}</span>
                      </div>
                      {goal.targetDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Target: {formatDate(goal.targetDate)}</span>
                        </div>
                      )}
                      {goal.completedAt && (
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>Completed: {formatDate(goal.completedAt)}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default GoalTracker; 