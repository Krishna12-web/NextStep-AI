import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Clock, 
  Brain,
  Activity,
  BarChart3
} from "lucide-react";

const Interview = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role");
  
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [stressLevel, setStressLevel] = useState(35);
  const [confidenceLevel, setConfidenceLevel] = useState(75);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const roleTitle = role?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Interview';

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeRemaining(120);
      setIsRecording(false);
      setAnswers(prev => [...prev, `Answer to: ${questions[currentQuestion]}`]);
    } else {
      // submit to backend
      try {
        const res = await fetch('/api/session/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, role, answers })
        });
        if (res.ok) {
          const data = await res.json();
          navigate('/results', { state: { results: data } });
          return;
        }
      } catch {
        // Error handling
      }
      navigate('/results');
    }
  };

  useEffect(() => {
    if (isRecording && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(time => time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleNextQuestion();
    }
  }, [isRecording, timeRemaining, handleNextQuestion]);

  useEffect(() => {
    // Simulate real-time stress/confidence updates
    if (isRecording) {
      const interval = setInterval(() => {
        setStressLevel(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 10)));
        setConfidenceLevel(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 8)));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  useEffect(() => {
    // Setup webcam
    if (isVideoEnabled && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.log('Error accessing camera:', err));
    }
  }, [isVideoEnabled]);

  useEffect(() => {
    // Load questions for selected role
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/questions?role=${encodeURIComponent(role || '')}`);
        if (!res.ok) throw new Error('Failed to load questions');
        const data = await res.json();
        setQuestions(Array.isArray(data.questions) ? data.questions : []);
      } catch (e: unknown) {
        setError((e as Error)?.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  const handleStartRecording = async () => {
    setIsRecording(true);
    setTimeRemaining(120);
    // start a backend session if not created
    if (!sessionId) {
      try {
        const res = await fetch('/api/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role })
        });
        if (res.ok) {
          const data = await res.json();
          setSessionId(data.sessionId);
        }
      } catch {
        // Error handling
      }
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStressColor = () => {
    if (stressLevel < 30) return "text-success";
    if (stressLevel < 60) return "text-warning";
    return "text-danger";
  };

  const getConfidenceColor = () => {
    if (confidenceLevel > 70) return "text-success";
    if (confidenceLevel > 40) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/select-role")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Interview
            </Button>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{roleTitle}</Badge>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Interview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Interview Question</h2>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-lg">
                  <p className="text-lg text-foreground leading-relaxed">
                    {loading ? 'Loading question...' : error ? `Error: ${error}` : questions[currentQuestion]}
                  </p>
                </div>
                
                <Progress 
                  value={((currentQuestion + 1) / questions.length) * 100} 
                  className="h-2"
                />
              </div>
            </Card>

            {/* Video Feed */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Video Feed</h3>
                <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                  {isVideoEnabled ? (
                    <video 
                      ref={videoRef}
                      autoPlay 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoOff className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-danger text-danger-foreground px-3 py-1 rounded-full text-sm">
                      <div className="w-2 h-2 bg-danger-foreground rounded-full animate-pulse" />
                      <span>Recording</span>
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  >
                    {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    size="lg"
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={isRecording 
                      ? "bg-danger hover:bg-danger/90" 
                      : "bg-gradient-to-r from-primary to-primary-glow"
                    }
                  >
                    {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                    {isRecording ? 'Stop Recording' : 'Start Answer'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleNextQuestion}
                    disabled={currentQuestion >= questions.length - 1}
                  >
                    Next Question
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Real-time Analytics */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Live Analysis</h3>
                </div>
                
                {/* Stress Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stress Level</span>
                    <span className={`text-sm font-medium ${getStressColor()}`}>
                      {Math.round(stressLevel)}%
                    </span>
                  </div>
                  <Progress 
                    value={stressLevel} 
                    className="h-2"
                  />
                </div>
                
                {/* Confidence Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className={`text-sm font-medium ${getConfidenceColor()}`}>
                      {Math.round(confidenceLevel)}%
                    </span>
                  </div>
                  <Progress 
                    value={confidenceLevel} 
                    className="h-2"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Quick Tips</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm p-3 bg-success/10 text-success-foreground rounded-lg">
                    💡 Maintain eye contact with the camera
                  </div>
                  <div className="text-sm p-3 bg-warning/10 text-warning-foreground rounded-lg">
                    ⚡ Slow down your speech slightly
                  </div>
                  <div className="text-sm p-3 bg-primary/10 text-primary-foreground rounded-lg">
                    🎯 Include specific examples in your answer
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Interview Progress</h3>
                <div className="space-y-3">
                  {questions.map((_, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index < currentQuestion ? 'bg-success' :
                        index === currentQuestion ? 'bg-primary' : 'bg-muted'
                      }`} />
                      <span className={`text-sm ${
                        index <= currentQuestion ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        Question {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;