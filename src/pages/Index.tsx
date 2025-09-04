import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Users, Zap, Shield, Target } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">TaskMate</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300" asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.15] md:leading-[1.3] pb-1 bg-gradient-hero bg-clip-text text-transparent">
            Manage Tasks Like a Pro
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay organized, boost productivity, and never miss a deadline. TaskMate helps you manage your tasks with elegance and efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300" asChild>
              <Link to="/login">
                Start Managing Tasks
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {/* <Button size="lg" variant="outline">
              View Demo
            </Button> */}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card p-8 rounded-2xl shadow-task border">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Organization</h3>
              <p className="text-muted-foreground">
                Organize your tasks with smart filters, deadlines, and status tracking. Never lose track of what matters most.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-task border">
              <div className="p-3 bg-accent/10 rounded-xl w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Create, edit, and manage tasks in seconds. Our intuitive interface ensures you spend less time organizing and more time doing.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-task border">
              <div className="p-3 bg-success/10 rounded-xl w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your data is encrypted and secure. Focus on your productivity while we handle the technical details behind the scenes.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-primary rounded-2xl p-8 text-white shadow-glow">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Organized?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who have transformed their productivity with TaskMate. Start your journey today.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/login">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center border-t">
        <p className="text-muted-foreground">
          © 2025 TaskMate. Built with care for productivity enthusiasts.
        </p>
      </footer>
    </div>
  );
};

export default Index;
