import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  BarChart3, 
  Brain, 
  Target, 
  TrendingUp,
  Clock,
  Eye,
  Volume2,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = (location.state as { results?: Record<string, unknown> })?.results;

  // Prefer backend results (if navigated from Interview submit), fallback to mock
  const overallScore = results?.overallScore ?? 78;
  const technicalScore = results?.technicalScore ?? 82;
  const softSkillsScore = results?.softSkillsScore ?? 74;
  const interviewDuration = results?.interviewDuration ?? "23:45";
  
  const skillBreakdown = results?.skillBreakdown ?? [
    { skill: "Communication", score: 85, status: "excellent" },
    { skill: "Technical Knowledge", score: 82, status: "good" },
    { skill: "Problem Solving", score: 79, status: "good" },
    { skill: "Confidence", score: 71, status: "fair" },
    { skill: "Eye Contact", score: 68, status: "needs-improvement" },
    { skill: "Speech Pace", score: 76, status: "good" }
  ];

  const stressTimeline = results?.stressTimeline ?? [
    { time: "0:30", stress: 45, confidence: 65 },
    { time: "2:15", stress: 38, confidence: 72 },
    { time: "5:20", stress: 52, confidence: 61 },
    { time: "8:45", stress: 35, confidence: 78 },
    { time: "12:30", stress: 41, confidence: 69 },
    { time: "15:15", stress: 29, confidence: 82 },
    { time: "18:40", stress: 33, confidence: 79 },
    { time: "21:25", stress: 27, confidence: 84 }
  ];

  const feedback = results?.feedback ?? [
    {
      type: "strength",
      title: "Excellent Technical Responses",
      description: "You provided detailed, accurate answers to technical questions with good examples.",
      icon: CheckCircle,
      color: "text-success"
    },
    {
      type: "improvement",
      title: "Eye Contact Consistency",
      description: "Try to maintain more consistent eye contact with the camera throughout your responses.",
      icon: AlertCircle,
      color: "text-warning"
    },
    {
      type: "improvement", 
      title: "Speech Pace Control",
      description: "You spoke quickly during stressful moments. Practice breathing techniques to maintain steady pace.",
      icon: Volume2,
      color: "text-warning"
    },
    {
      type: "strength",
      title: "Strong Problem-Solving Approach",
      description: "Your systematic approach to breaking down complex problems was impressive.",
      icon: CheckCircle,
      color: "text-success"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge variant="outline" className="text-success border-success">Excellent</Badge>;
      case "good":
        return <Badge variant="outline" className="text-primary border-primary">Good</Badge>;
      case "fair":
        return <Badge variant="outline" className="text-warning border-warning">Fair</Badge>;
      case "needs-improvement":
        return <Badge variant="outline" className="text-danger border-danger">Needs Work</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/select-role")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              New Interview
            </Button>
            
            <h1 className="text-2xl font-bold text-foreground">Interview Results</h1>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${getScoreColor(technicalScore)}`}>
                {technicalScore}%
              </div>
              <div className="text-sm text-muted-foreground">Technical Skills</div>
            </div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${getScoreColor(softSkillsScore)}`}>
                {softSkillsScore}%
              </div>
              <div className="text-sm text-muted-foreground">Soft Skills</div>
            </div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {interviewDuration}
              </div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="breakdown" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="breakdown">
              <BarChart3 className="w-4 h-4 mr-2" />
              Breakdown
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <Brain className="w-4 h-4 mr-2" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="improvement">
              <Target className="w-4 h-4 mr-2" />
              Next Steps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Skill Breakdown</h3>
              <div className="space-y-6">
                {skillBreakdown.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-medium">{skill.skill}</span>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(skill.status)}
                        <span className={`font-bold ${getScoreColor(skill.score)}`}>
                          {skill.score}%
                        </span>
                      </div>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Stress & Confidence Timeline</h3>
              <div className="space-y-4">
                {stressTimeline.map((point, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2 w-16">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-mono">{point.time}</span>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Stress</span>
                        <span className={`text-sm font-medium ${getScoreColor(100 - point.stress)}`}>
                          {point.stress}%
                        </span>
                      </div>
                      <Progress value={point.stress} className="h-1" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Confidence</span>
                        <span className={`text-sm font-medium ${getScoreColor(point.confidence)}`}>
                          {point.confidence}%
                        </span>
                      </div>
                      <Progress value={point.confidence} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="space-y-4">
              {feedback.map((item, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="improvement">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Recommended Next Steps</h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground flex items-center">
                      <Eye className="w-4 h-4 mr-2 text-primary" />
                      Practice Eye Contact
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Record yourself answering questions</li>
                      <li>• Practice looking directly at the camera</li>
                      <li>• Use a small arrow sticker near your camera</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground flex items-center">
                      <Volume2 className="w-4 h-4 mr-2 text-primary" />
                      Improve Speech Pace
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Practice deep breathing before answering</li>
                      <li>• Count to 2 before starting your response</li>
                      <li>• Use pauses to emphasize key points</li>
                    </ul>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border">
                  <div className="text-center space-y-4">
                    <h4 className="font-semibold text-foreground">Ready for another practice session?</h4>
                    <Button 
                      size="lg"
                      onClick={() => navigate("/select-role")}
                      className="bg-gradient-to-r from-primary to-primary-glow"
                    >
                      Start New Interview
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Results;