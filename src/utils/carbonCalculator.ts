export interface QuestionnaireData {
  transportMode: string;
  weeklyDistance: number;
  electricityBill: number;
  dietType: string;
  treesPlanted: number;
  recyclingHabits: string;
  homeSize: string;
  flightsPerYear: number;
}

export interface FootprintResult {
  totalScore: number;
  category: 'good' | 'bad';
  breakdown: {
    transport: number;
    electricity: number;
    diet: number;
    housing: number;
    flights: number;
    offset: number;
  };
  tip: string;
}

// Carbon emission factors (simplified for demo)
const EMISSION_FACTORS = {
  transport: {
    car: 0.21, // kg CO2 per km
    bus: 0.08,
    train: 0.04,
    bicycle: 0,
    walking: 0,
    motorcycle: 0.15
  },
  electricity: 0.5, // kg CO2 per kWh (average grid)
  diet: {
    meat_heavy: 3.3, // kg CO2 per day
    meat_moderate: 2.5,
    vegetarian: 1.7,
    vegan: 1.5
  },
  housing: {
    small: 1.2, // multiplier
    medium: 1.5,
    large: 2.0,
    very_large: 2.5
  },
  flights: 0.25, // kg CO2 per km (average domestic/international)
  treeOffset: 22 // kg CO2 absorbed per tree per year
};

const TIPS = {
  good: [
    "Keep up the great work! Consider sharing your eco-friendly habits with friends and family.",
    "You're doing amazing! Try switching to renewable energy if you haven't already.",
    "Excellent carbon footprint! Consider offsetting your remaining emissions through verified carbon credits.",
    "Outstanding! Your lifestyle choices are helping combat climate change effectively."
  ],
  bad: [
    "Consider using public transport or cycling more often to reduce transportation emissions.",
    "Try reducing meat consumption and eating more plant-based meals throughout the week.",
    "Plant more trees or support reforestation projects to offset your carbon emissions.",
    "Switch to energy-efficient appliances and consider renewable energy sources for your home.",
    "Reduce air travel and choose local destinations for vacations when possible."
  ]
};

export const calculateCarbonFootprint = (data: QuestionnaireData): FootprintResult => {
  const breakdown = {
    transport: 0,
    electricity: 0,
    diet: 0,
    housing: 0,
    flights: 0,
    offset: 0
  };

  // Calculate transport emissions (weekly distance * 52 weeks)
  const transportFactor = EMISSION_FACTORS.transport[data.transportMode as keyof typeof EMISSION_FACTORS.transport] || 0.21;
  breakdown.transport = data.weeklyDistance * 52 * transportFactor;

  // Calculate electricity emissions (monthly bill * 12 months)
  breakdown.electricity = data.electricityBill * 12 * EMISSION_FACTORS.electricity;

  // Calculate diet emissions (daily * 365 days)
  const dietFactor = EMISSION_FACTORS.diet[data.dietType as keyof typeof EMISSION_FACTORS.diet] || 2.5;
  breakdown.diet = dietFactor * 365;

  // Calculate housing emissions
  const houseFactor = EMISSION_FACTORS.housing[data.homeSize as keyof typeof EMISSION_FACTORS.housing] || 1.5;
  breakdown.housing = breakdown.electricity * houseFactor;

  // Calculate flight emissions (assuming average 1000km per flight)
  breakdown.flights = data.flightsPerYear * 1000 * EMISSION_FACTORS.flights;

  // Calculate tree offset (negative emissions)
  breakdown.offset = -(data.treesPlanted * EMISSION_FACTORS.treeOffset);

  // Add recycling bonus
  const recyclingBonus = data.recyclingHabits === 'always' ? -200 : 
                        data.recyclingHabits === 'sometimes' ? -100 : 0;

  const totalScore = Object.values(breakdown).reduce((sum, value) => sum + value, 0) + recyclingBonus;

  // Determine category (threshold: 4000 kg CO2 per year)
  const category: 'good' | 'bad' = totalScore <= 4000 ? 'good' : 'bad';

  // Get random tip
  const tips = TIPS[category];
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return {
    totalScore: Math.max(0, totalScore), // Ensure non-negative
    category,
    breakdown,
    tip
  };
};

export const saveFootprintResult = (userId: string, result: FootprintResult, data: QuestionnaireData) => {
  const history = JSON.parse(localStorage.getItem(`footprint_history_${userId}`) || '[]');
  const entry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    result,
    data
  };
  history.unshift(entry); // Add to beginning
  localStorage.setItem(`footprint_history_${userId}`, JSON.stringify(history));
};

export const getFootprintHistory = (userId: string) => {
  return JSON.parse(localStorage.getItem(`footprint_history_${userId}`) || '[]');
};