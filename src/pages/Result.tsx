import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, TrendingUp, BarChart3, ArrowRight, Lightbulb } from 'lucide-react';
import { FootprintResult, QuestionnaireData } from '../utils/carbonCalculator';
import goodFootprintImg from '../assets/good-footprint.png';
import badFootprintImg from '../assets/bad-footprint.png';

const Result = () => {
  const [data, setData] = useState<{ result: FootprintResult; formData: QuestionnaireData } | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('calculationResult');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <BarChart3 className="h-24 w-24 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            No Results Found
          </h1>
          <p className="text-muted-foreground mb-6">
            Please complete the calculator first to see your results.
          </p>
          <button 
            onClick={() => window.location.href = '/calculator'}
            className="btn-primary"
          >
            Start Calculator
          </button>
        </div>
      </div>
    );
  }

  const { result, formData } = data;
  const isGoodFootprint = result.category === 'good';

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Results Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Carbon Footprint Results
          </h1>
          <p className="text-xl text-muted-foreground">
            Based on your lifestyle choices and habits
          </p>
        </div>

        {/* Main Result Card */}
        <div className={isGoodFootprint ? 'card-result-good' : 'card-result-bad'}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center justify-center md:justify-start mb-4">
                {isGoodFootprint ? (
                  <CheckCircle className="h-12 w-12 text-footprint-good mr-4" />
                ) : (
                  <XCircle className="h-12 w-12 text-footprint-bad mr-4" />
                )}
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    {isGoodFootprint ? 'You Have Good Footprints!' : 'You Have Bad Footprints!'}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {result.totalScore.toFixed(0)} kg CO₂ per year
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  isGoodFootprint 
                    ? 'bg-footprint-good/10 text-footprint-good' 
                    : 'bg-footprint-bad/10 text-footprint-bad'
                }`}>
                  {isGoodFootprint ? '🌱 Eco-Friendly Lifestyle' : '⚠️ High Impact Lifestyle'}
                </div>
              </div>

              <div className="bg-white/50 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">💡 Recommendation</h4>
                    <p className="text-foreground/80">{result.tip}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <img 
                src={isGoodFootprint ? goodFootprintImg : badFootprintImg}
                alt={isGoodFootprint ? 'Good Footprint' : 'Bad Footprint'}
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Breakdown Chart */}
        <div className="card-eco mt-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Emissions Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(result.breakdown).map(([category, value]) => {
              const isOffset = value < 0;
              const displayValue = Math.abs(value);
              
              return (
                <div key={category} className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    isOffset ? 'bg-footprint-good/20' : 'bg-primary/20'
                  }`}>
                    <TrendingUp className={`h-8 w-8 ${
                      isOffset ? 'text-footprint-good' : 'text-primary'
                    }`} />
                  </div>
                  <h4 className="font-semibold text-foreground capitalize mb-1">
                    {category}
                  </h4>
                  <p className={`text-lg font-bold ${
                    isOffset ? 'text-footprint-good' : 'text-foreground'
                  }`}>
                    {isOffset ? '-' : ''}{displayValue.toFixed(0)} kg
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CO₂ per year
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-eco text-center">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-3">
              View Your History
            </h3>
            <p className="text-muted-foreground mb-4">
              Track your progress and see how your footprint changes over time.
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="btn-primary w-full"
            >
              Go to Dashboard
            </button>
          </div>

          <div className="card-eco text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Calculate Again
            </h3>
            <p className="text-muted-foreground mb-4">
              Update your lifestyle data and see how changes affect your footprint.
            </p>
            <button 
              onClick={() => window.location.href = '/calculator'}
              className="btn-outline w-full"
            >
              New Calculation
            </button>
          </div>
        </div>

        {/* Global Impact */}
        <div className="mt-8 hero-gradient rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
          <p className="text-lg mb-6 text-white/90">
            The average global carbon footprint is 4,800 kg CO₂ per year. 
            {isGoodFootprint 
              ? ' You\'re doing better than average! Keep it up and inspire others.'
              : ' Small changes can make a big difference. Every step towards sustainability counts.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/contact'}
              className="px-6 py-3 bg-white text-primary rounded-lg font-semibold
                       hover:bg-white/90 transition-all duration-200"
            >
              Get More Tips
            </button>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Carbon Footprint Results',
                    text: `I just calculated my carbon footprint: ${result.totalScore.toFixed(0)} kg CO₂/year. Check yours!`,
                    url: window.location.origin
                  });
                }
              }}
              className="px-6 py-3 border-2 border-white/30 text-white rounded-lg font-semibold
                       hover:bg-white/10 transition-all duration-200"
            >
              Share Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;