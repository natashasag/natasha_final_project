import React from 'react';
import { Calculator, TrendingDown, Users, Award, ArrowRight, Leaf, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import heroImage from '../assets/hero-bg.jpg';

const Home = () => {
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      window.location.href = '/calculator';
    } else {
      window.location.href = '/auth';
    }
  };

  const features = [
    {
      icon: Calculator,
      title: "Smart Calculator",
      description: "Advanced algorithms calculate your carbon footprint based on lifestyle data"
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Monitor your environmental impact over time with detailed analytics"
    },
    {
      icon: TrendingDown,
      title: "Reduce Emissions",
      description: "Get personalized tips to minimize your carbon footprint effectively"
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Your personal data is protected with enterprise-grade security"
    }
  ];

  const stats = [
    { number: "50K+", label: "Users Tracked", icon: Users },
    { number: "2.5M", label: "Tons CO₂ Saved", icon: TrendingDown },
    { number: "98%", label: "Accuracy Rate", icon: Award },
    { number: "150+", label: "Countries", icon: Leaf }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 hero-gradient opacity-80"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="animate-float">
            <h1 className="hero-text mb-6">
              Track Your Carbon
              <br />
              <span className="text-accent">Footprints</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
              Calculate, monitor, and reduce your environmental impact with our 
              professional carbon footprint calculator. Join thousands making a difference.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleGetStarted}
                className="btn-eco group"
              >
                {user ? 'Start Calculating' : 'Get Started Free'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => window.location.href = '/contact'}
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg
                         hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse-eco"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent/20 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-primary/30 rounded-full animate-pulse-eco"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 
                              bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 
                              transition-colors duration-300">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose <span className="text-gradient-primary">Footprints</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines accuracy, simplicity, and actionable insights 
              to help you make a real environmental impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-eco hover-lift group">
                <div className="inline-flex items-center justify-center w-12 h-12 
                              bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 
                              transition-colors duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of environmentally conscious individuals tracking 
            and reducing their carbon footprint today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-primary rounded-xl font-semibold text-lg
                       hover:bg-white/90 hover:scale-105 transition-all duration-300 
                       shadow-lg hover:shadow-xl"
            >
              {user ? 'Calculate Now' : 'Sign Up Free'}
            </button>
            
            {!user && (
              <button 
                onClick={() => window.location.href = '/auth'}
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg
                         hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Already Have Account?
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;