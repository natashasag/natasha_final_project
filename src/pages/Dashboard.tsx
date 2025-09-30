import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingDown, TrendingUp, Calendar, Calculator, Leaf, History } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getFootprintHistory } from '../utils/carbonCalculator';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const userHistory = getFootprintHistory(user.id);
      setHistory(userHistory);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <BarChart3 className="h-24 w-24 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Please Login to Continue
          </h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your dashboard.
          </p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="btn-primary"
          >
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const latestResult = history[0];
  const averageFootprint = history.length > 0 
    ? history.reduce((sum, entry) => sum + entry.result.totalScore, 0) / history.length 
    : 0;

  const goodCount = history.filter(entry => entry.result.category === 'good').length;
  const improvementTrend = history.length >= 2 
    ? history[0].result.totalScore < history[1].result.totalScore 
    : null;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.name}! 
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your environmental impact and progress over time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-eco">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Calculations</p>
                <p className="text-3xl font-bold text-foreground">{history.length}</p>
              </div>
              <Calculator className="h-12 w-12 text-primary/60" />
            </div>
          </div>

          <div className="card-eco">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Good Footprints</p>
                <p className="text-3xl font-bold text-footprint-good">{goodCount}</p>
              </div>
              <Leaf className="h-12 w-12 text-footprint-good/60" />
            </div>
          </div>

          <div className="card-eco">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Average Footprint</p>
                <p className="text-3xl font-bold text-foreground">
                  {averageFootprint.toFixed(0)}
                  <span className="text-sm text-muted-foreground ml-1">kg CO₂</span>
                </p>
              </div>
              <BarChart3 className="h-12 w-12 text-primary/60" />
            </div>
          </div>

          <div className="card-eco">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Trend</p>
                <div className="flex items-center">
                  {improvementTrend === null ? (
                    <span className="text-2xl font-bold text-muted-foreground">—</span>
                  ) : improvementTrend ? (
                    <>
                      <TrendingDown className="h-6 w-6 text-footprint-good mr-2" />
                      <span className="text-2xl font-bold text-footprint-good">Improving</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-6 w-6 text-footprint-bad mr-2" />
                      <span className="text-2xl font-bold text-footprint-bad">Increasing</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Result */}
        {latestResult && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Latest Result</h2>
            <div className={latestResult.result.category === 'good' ? 'card-result-good' : 'card-result-bad'}>
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {latestResult.result.category === 'good' 
                      ? '🌱 You Have Good Footprints!' 
                      : '⚠️ You Have Bad Footprints!'
                    }
                  </h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    {latestResult.result.totalScore.toFixed(0)} kg CO₂ per year
                  </p>
                  <p className="text-foreground/80 mb-4">
                    <strong>💡 Tip:</strong> {latestResult.result.tip}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Calculated on {new Date(latestResult.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button 
                    onClick={() => window.location.href = '/calculator'}
                    className="btn-primary"
                  >
                    Calculate Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        <div className="card-eco">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center">
              <History className="h-6 w-6 mr-2" />
              Calculation History
            </h2>
            {history.length === 0 && (
              <button 
                onClick={() => window.location.href = '/calculator'}
                className="btn-primary"
              >
                Start First Calculation
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <Calculator className="h-24 w-24 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No calculations yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start your first carbon footprint calculation to see your environmental impact.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={entry.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          entry.result.category === 'good' ? 'bg-footprint-good' : 'bg-footprint-bad'
                        }`}></div>
                        <span className="font-semibold text-foreground">
                          {entry.result.category === 'good' ? 'Good Footprints' : 'Bad Footprints'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-foreground mb-1">
                        {entry.result.totalScore.toFixed(0)} kg CO₂/year
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Transport: {entry.data.transportMode} • Diet: {entry.data.dietType.replace('_', ' ')} • Trees: {entry.data.treesPlanted}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                      {index === 0 && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                          Latest
                        </span>
                      )}
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        {history.length > 0 && (
          <div className="mt-8 hero-gradient rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Keep Tracking Your Impact</h3>
            <p className="text-lg mb-6 text-white/90">
              Regular monitoring helps you understand your environmental impact and make informed decisions.
            </p>
            <button 
              onClick={() => window.location.href = '/calculator'}
              className="px-8 py-3 bg-white text-primary rounded-lg font-semibold
                       hover:bg-white/90 transition-all duration-200 hover:scale-105"
            >
              New Calculation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;