import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Calculator as CalcIcon, TreePine, Car, Home, Utensils, Plane, Recycle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { calculateCarbonFootprint, saveFootprintResult, QuestionnaireData } from '../utils/carbonCalculator';
import { toast } from '../hooks/use-toast';

const Calculator = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    transportMode: '',
    weeklyDistance: 0,
    electricityBill: 0,
    dietType: '',
    treesPlanted: 0,
    recyclingHabits: '',
    homeSize: '',
    flightsPerYear: 0
  });

  const questions = [
    {
      id: 1,
      icon: Car,
      title: "Transportation",
      question: "What's your primary mode of transportation?",
      field: "transportMode",
      type: "select",
      options: [
        { value: "car", label: "Personal Car" },
        { value: "bus", label: "Public Bus" },
        { value: "train", label: "Train/Metro" },
        { value: "bicycle", label: "Bicycle" },
        { value: "walking", label: "Walking" },
        { value: "motorcycle", label: "Motorcycle" }
      ]
    },
    {
      id: 2,
      icon: Car,
      title: "Travel Distance", 
      question: "How many kilometers do you travel per week?",
      field: "weeklyDistance",
      type: "number",
      placeholder: "e.g., 150"
    },
    {
      id: 3,
      icon: Home,
      title: "Electricity Usage",
      question: "What's your average monthly electricity bill (in $)?",
      field: "electricityBill", 
      type: "number",
      placeholder: "e.g., 120"
    },
    {
      id: 4,
      icon: Home,
      title: "Home Size",
      question: "What size is your home?",
      field: "homeSize",
      type: "select",
      options: [
        { value: "small", label: "Small (1-2 rooms)" },
        { value: "medium", label: "Medium (3-4 rooms)" },
        { value: "large", label: "Large (5-6 rooms)" },
        { value: "very_large", label: "Very Large (7+ rooms)" }
      ]
    },
    {
      id: 5,
      icon: Utensils,
      title: "Diet Type",
      question: "What best describes your diet?",
      field: "dietType",
      type: "select", 
      options: [
        { value: "meat_heavy", label: "Meat Heavy (daily meat)" },
        { value: "meat_moderate", label: "Moderate Meat (3-4 times/week)" },
        { value: "vegetarian", label: "Vegetarian" },
        { value: "vegan", label: "Vegan" }
      ]
    },
    {
      id: 6,
      icon: Plane,
      title: "Air Travel",
      question: "How many flights do you take per year?",
      field: "flightsPerYear",
      type: "number",
      placeholder: "e.g., 4"
    },
    {
      id: 7,
      icon: Recycle,
      title: "Recycling Habits",
      question: "How often do you recycle?",
      field: "recyclingHabits",
      type: "select",
      options: [
        { value: "always", label: "Always recycle" },
        { value: "sometimes", label: "Sometimes" },
        { value: "rarely", label: "Rarely" },
        { value: "never", label: "Never" }
      ]
    },
    {
      id: 8,
      icon: TreePine,
      title: "Tree Planting",
      question: "How many trees have you planted this year?",
      field: "treesPlanted",
      type: "number",
      placeholder: "e.g., 5"
    }
  ];

  const currentQuestion = questions.find(q => q.id === currentStep);
  const totalSteps = questions.length;

  const handleInputChange = (value: string | number) => {
    if (currentQuestion) {
      setFormData(prev => ({
        ...prev,
        [currentQuestion.field]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your results",
        variant: "destructive"
      });
      window.location.href = '/auth';
      return;
    }

    const result = calculateCarbonFootprint(formData);
    saveFootprintResult(user.id, result, formData);
    
    // Navigate to results page with data
    sessionStorage.setItem('calculationResult', JSON.stringify({ result, formData }));
    window.location.href = '/result';
  };

  const getCurrentValue = () => {
    if (currentQuestion) {
      return formData[currentQuestion.field as keyof QuestionnaireData];
    }
    return '';
  };

  const isCurrentStepValid = () => {
    const value = getCurrentValue();
    if (currentQuestion?.type === 'select') {
      return value !== '';
    } else if (currentQuestion?.type === 'number') {
      return value !== '' && typeof value === 'number' && value >= 0;
    }
    return false;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <CalcIcon className="h-24 w-24 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Please Login to Continue
          </h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to use the carbon footprint calculator.
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

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Carbon Footprint Calculator</h1>
            <span className="text-sm text-muted-foreground">
              {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="hero-gradient h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="card-eco">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <currentQuestion.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{currentQuestion.title}</h3>
                <p className="text-muted-foreground">{currentQuestion.question}</p>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-8">
              {currentQuestion.type === 'select' ? (
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange(option.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        getCurrentValue() === option.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="number"
                  value={getCurrentValue() || ''}
                  onChange={(e) => handleInputChange(Number(e.target.value))}
                  placeholder={currentQuestion.placeholder}
                  className="input-eco text-lg"
                  min="0"
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-border rounded-lg
                         hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center space-x-2"
              >
                <span>{currentStep === totalSteps ? 'Calculate' : 'Next'}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;