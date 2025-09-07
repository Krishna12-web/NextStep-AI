/*
  Lightweight backend for NextStep-AI
  - Serves role list
  - Generates role-specific questions
  - Accepts interview session submissions and returns mock analytics
  - Health endpoint
*/

import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Serve frontend static files from Vite build output
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// In-memory data (would be DB in production)
const roles = [
  { id: 'software-engineer', title: 'Software Engineer', level: 'All Levels', questions: 15, description: 'Technical coding interviews, algorithms, system design', color: 'text-primary' },
  { id: 'product-manager', title: 'Product Manager', level: 'Mid-Senior', questions: 12, description: 'Strategy, roadmapping, stakeholder management', color: 'text-success' },
  { id: 'ui-ux-designer', title: 'UI/UX Designer', level: 'All Levels', questions: 10, description: 'Design thinking, user research, portfolio review', color: 'text-warning' },
  { id: 'marketing-manager', title: 'Marketing Manager', level: 'Mid-Senior', questions: 12, description: 'Campaign strategy, analytics, brand management', color: 'text-danger' },
  { id: 'sales-representative', title: 'Sales Representative', level: 'All Levels', questions: 10, description: 'Client relations, negotiation, sales process', color: 'text-primary-glow' },
  { id: 'devops-engineer', title: 'DevOps Engineer', level: 'Mid-Senior', questions: 14, description: 'Infrastructure, CI/CD, cloud platforms', color: 'text-success-glow' },
];

function generateQuestions(roleId) {
  const common = [
    'Tell me about yourself and your background in this field.',
    'What interests you most about this role and our company?',
    "Describe a challenging project you've worked on and how you overcame obstacles.",
    'How do you handle working under pressure and tight deadlines?',
    'Where do you see yourself in the next 5 years?'
  ];

  switch (roleId) {
    case 'software-engineer':
      return [
        'Walk through your approach to solving a hard algorithmic problem.',
        'Explain a system you designed. How did you handle scalability?',
        'Describe a time you improved performance or reduced costs.',
        ...common
      ];
    case 'product-manager':
      return [
        'How do you prioritize a roadmap with conflicting stakeholder needs?',
        'Describe your approach to defining success metrics for a feature.',
        'Tell me about a product decision you would change and why.',
        ...common
      ];
    case 'ui-ux-designer':
      return [
        'Describe your end-to-end design process for a new feature.',
        'How do you validate your design decisions?',
        'Share an example where user research changed your solution.',
        ...common
      ];
    case 'marketing-manager':
      return [
        'How do you structure a multi-channel campaign for a product launch?',
        'Discuss a time you turned around underperforming metrics.',
        'What KPIs do you track and why?',
        ...common
      ];
    case 'sales-representative':
      return [
        'Walk me through your sales process from prospecting to close.',
        'Tell me about handling a difficult objection and the outcome.',
        'How do you build and maintain client relationships?',
        ...common
      ];
    case 'devops-engineer':
      return [
        'Describe your CI/CD pipeline design and security considerations.',
        'How do you approach observability and incident response?',
        'Share a time you improved reliability or lowered MTTR.',
        ...common
      ];
    default:
      return common;
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/roles', (_req, res) => {
  res.json({ roles });
});

app.get('/api/questions', (req, res) => {
  const role = (req.query.role || '').toString();
  const questions = generateQuestions(role);
  res.json({ role, questions });
});

app.post('/api/session/start', (req, res) => {
  const { role } = req.body || {};
  const sessionId = randomUUID();
  const startedAt = new Date().toISOString();
  res.json({ sessionId, role, startedAt });
});

app.post('/api/session/submit', (req, res) => {
  const { sessionId, role, answers } = req.body || {};
  // Basic mock scoring logic; in a real system, call ML models here.
  const technicalBase = role === 'software-engineer' || role === 'devops-engineer' ? 78 : 70;
  const softBase = 72;

  const lengthBonus = Array.isArray(answers) ? Math.min(answers.length, 10) : 0;

  const technicalScore = Math.min(100, technicalBase + Math.floor(Math.random() * 10));
  const softSkillsScore = Math.min(100, softBase + Math.floor(Math.random() * 10));
  const overallScore = Math.round((technicalScore * 0.6 + softSkillsScore * 0.4));
  const interviewDuration = '23:45';

  const stressTimeline = [
    { time: '0:30', stress: 45, confidence: 65 },
    { time: '2:15', stress: 38, confidence: 72 },
    { time: '5:20', stress: 52, confidence: 61 },
    { time: '8:45', stress: 35, confidence: 78 },
    { time: '12:30', stress: 41, confidence: 69 },
    { time: '15:15', stress: 29, confidence: 82 },
    { time: '18:40', stress: 33, confidence: 79 },
    { time: '21:25', stress: 27, confidence: 84 },
  ];

  const skillBreakdown = [
    { skill: 'Communication', score: 85, status: 'excellent' },
    { skill: 'Technical Knowledge', score: technicalScore, status: technicalScore >= 80 ? 'good' : 'fair' },
    { skill: 'Problem Solving', score: 79 + Math.floor(Math.random() * 6), status: 'good' },
    { skill: 'Confidence', score: softSkillsScore, status: softSkillsScore >= 80 ? 'good' : 'fair' },
    { skill: 'Eye Contact', score: 68, status: 'needs-improvement' },
    { skill: 'Speech Pace', score: 76, status: 'good' },
  ];

  const feedback = [
    {
      type: 'strength',
      title: 'Excellent Technical Responses',
      description: 'You provided detailed, accurate answers to technical questions with good examples.',
      icon: 'CheckCircle',
      color: 'text-success',
    },
    {
      type: 'improvement',
      title: 'Eye Contact Consistency',
      description: 'Try to maintain more consistent eye contact with the camera throughout your responses.',
      icon: 'AlertCircle',
      color: 'text-warning',
    },
    {
      type: 'improvement',
      title: 'Speech Pace Control',
      description: 'You spoke quickly during stressful moments. Practice breathing techniques to maintain steady pace.',
      icon: 'Volume2',
      color: 'text-warning',
    },
    {
      type: 'strength',
      title: 'Strong Problem-Solving Approach',
      description: 'Your systematic approach to breaking down complex problems was impressive.',
      icon: 'CheckCircle',
      color: 'text-success',
    },
  ];

  res.json({
    sessionId,
    role,
    answersCount: Array.isArray(answers) ? answers.length : 0,
    technicalScore: technicalScore + lengthBonus,
    softSkillsScore,
    overallScore: Math.min(100, overallScore + Math.floor(lengthBonus / 2)),
    interviewDuration,
    stressTimeline,
    skillBreakdown,
    feedback,
  });
});

// SPA fallback for all non-API routes (Express 5 compatible)
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
