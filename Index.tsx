import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, BarChart3, Target, Zap } from "lucide-react";
import heroImage from "@/assets/hero-interview.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Questions",
      description: "Domain-specific interview questions tailored to your role"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analysis",
      description: "Live emotion and stress detection during your responses"
    },
    {
      icon: Target,
      title: "Dual Evaluation",
      description: "Assessment of both technical skills and soft skills"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Immediate personalized coaching and improvement tips"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="glass-nav">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">NextStep-AI</span>
          </div>
          <Button variant="outline" onClick={() => navigate("/select-role")}>
            Start Interview
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="text-primary">
                  AI-Powered Interview Coaching
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Master Your Next
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    {" "}Interview
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Practice with AI, get real-time feedback on your emotions and stress levels, 
                  and build confidence for your dream job interview.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/select-role")}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
                >
                  Start Practice Interview
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">10k+</div>
                  <div className="text-sm text-muted-foreground">Interviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">Real-time</div>
                  <div className="text-sm text-muted-foreground">Feedback</div>
                </div>
              </div>
            </div>

            <div className="relative float-gentle">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="AI Interview Coach Platform" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why Choose NextStep-AI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI technology provides comprehensive interview preparation 
              with real-time emotion and stress analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card card-hover-glow p-6 border-0">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="glass-card p-12 text-center border-primary/20">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Ace Your Interview?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of successful candidates who've improved their interview 
                skills with our AI-powered coaching platform.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/select-role")}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/25"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;