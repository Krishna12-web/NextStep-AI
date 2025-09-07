import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Code2, Briefcase, Palette, TrendingUp, Users, Wrench } from "lucide-react";

interface Role {
  id: string;
  title: string;
  icon?: React.ComponentType;
  description: string;
  level: string;
  questions: number;
  color: string;
}

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("");

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/roles');
        if (!res.ok) throw new Error('Failed to load roles');
        const data = await res.json();
        setRoles(Array.isArray(data.roles) ? data.roles : []);
      } catch (e: unknown) {
        setError((e as Error)?.message || 'Failed to load roles');
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleStartInterview = () => {
    if (selectedRole) {
      navigate(`/interview?role=${selectedRole}`);
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
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Select Your Role</h1>
            <div />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Choose Your Interview Role
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the position you're preparing for. Our AI will customize questions 
            and evaluation criteria specific to your chosen role.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground mb-12">Loading roles...</div>
        ) : error ? (
          <div className="text-center text-danger mb-12">{error}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {roles.map((role: Role) => (
              <Card 
                key={role.id}
                className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedRole === role.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-card-hover'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${role.color || 'text-primary'}`}>
                      {/* icon mapping is only available for local static roles; show initial letter instead */}
                      <span className="font-semibold">{(role.title || role.id || '?').toString().charAt(0)}</span>
                    </div>
                    <Badge variant="outline">{role.level || 'All Levels'}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {role.questions} Questions
                    </span>
                    <span className="text-muted-foreground">
                      ~30 minutes
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Selected Role Summary */}
        {selectedRole && (
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  {roles.find(r => r.id === selectedRole)?.title} Interview
                </h3>
                <p className="text-muted-foreground">
                  You'll be evaluated on both technical competency and soft skills including 
                  confidence, communication, and stress management.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleStartInterview}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/25"
                >
                  Start Interview
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Preview Questions
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default RoleSelection;