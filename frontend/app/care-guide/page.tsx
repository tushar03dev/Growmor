"use client";

import {
  Leaf,
  Droplets,
  Sun,
  Thermometer,
  Scissors,
  Bug,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const careCategories = [
  {
    icon: Droplets,
    title: "Watering",
    description: "Master the art of proper hydration",
    tips: [
      "Check soil moisture with your finger - stick it 1-2 inches deep",
      "Water thoroughly until water drains from the bottom",
      "Most plants prefer to dry out slightly between waterings",
      "Use room temperature water to avoid shocking roots",
    ],
  },
  {
    icon: Sun,
    title: "Lighting",
    description: "Find the perfect spot for your plants",
    tips: [
      "Bright indirect light works for most houseplants",
      "South-facing windows provide the most intense light",
      "Rotate plants weekly for even growth",
      "Use grow lights if natural light is limited",
    ],
  },
  {
    icon: Thermometer,
    title: "Temperature & Humidity",
    description: "Create the ideal environment",
    tips: [
      "Most houseplants thrive in 65-75°F (18-24°C)",
      "Avoid placing plants near heating/cooling vents",
      "Increase humidity with pebble trays or humidifiers",
      "Group plants together to create a humid microclimate",
    ],
  },
  {
    icon: Scissors,
    title: "Pruning & Maintenance",
    description: "Keep your plants healthy and shaped",
    tips: [
      "Remove dead, yellowing, or damaged leaves promptly",
      "Pinch growing tips to encourage bushier growth",
      "Clean leaves regularly with a damp cloth",
      "Repot when roots outgrow the container",
    ],
  },
];

const plantTypes = [
  {
    name: "Succulents",
    difficulty: "Beginner",
    watering: "Every 1-2 weeks",
    light: "Bright direct",
    tips: "Allow soil to dry completely between waterings. Overwatering is the #1 killer of succulents.",
  },
  {
    name: "Pothos",
    difficulty: "Beginner",
    watering: "Weekly",
    light: "Low to bright indirect",
    tips: "Very forgiving and adaptable. Can grow in water or soil. Trim to maintain shape.",
  },
  {
    name: "Fiddle Leaf Fig",
    difficulty: "Intermediate",
    watering: "When top inch is dry",
    light: "Bright indirect",
    tips: "Consistent watering and lighting are key. Don't move frequently once established.",
  },
  {
    name: "Monstera",
    difficulty: "Intermediate",
    watering: "When top 2 inches dry",
    light: "Bright indirect",
    tips: "Provide a moss pole for climbing. Fenestrations develop with age and proper care.",
  },
  {
    name: "Orchids",
    difficulty: "Advanced",
    watering: "Weekly with ice cubes",
    light: "Bright indirect",
    tips: "Use orchid bark mix. Allow good air circulation around roots.",
  },
  {
    name: "Calathea",
    difficulty: "Advanced",
    watering: "Keep consistently moist",
    light: "Medium indirect",
    tips: "Requires high humidity and filtered water. Leaves fold up at night.",
  },
];

const commonProblems = [
  {
    problem: "Yellow Leaves",
    causes: ["Overwatering", "Natural aging", "Nutrient deficiency"],
    solutions: [
      "Check soil moisture",
      "Remove affected leaves",
      "Adjust watering schedule",
    ],
  },
  {
    problem: "Brown Leaf Tips",
    causes: ["Low humidity", "Fluoride in water", "Overfertilizing"],
    solutions: ["Increase humidity", "Use filtered water", "Reduce fertilizer"],
  },
  {
    problem: "Drooping/Wilting",
    causes: ["Underwatering", "Overwatering", "Root bound"],
    solutions: [
      "Check soil moisture",
      "Improve drainage",
      "Consider repotting",
    ],
  },
  {
    problem: "Slow Growth",
    causes: ["Insufficient light", "Wrong season", "Nutrient deficiency"],
    solutions: [
      "Move to brighter location",
      "Be patient in winter",
      "Fertilize during growing season",
    ],
  },
];

const seasonalTips = [
  {
    season: "Spring",
    icon: "🌱",
    tips: [
      "Resume regular fertilizing as plants enter growing season",
      "Repot plants that have outgrown their containers",
      "Increase watering frequency as days get longer",
      "Start propagating your favorite plants",
    ],
  },
  {
    season: "Summer",
    icon: "☀️",
    tips: [
      "Water more frequently due to increased evaporation",
      "Provide extra humidity during hot days",
      "Move plants away from air conditioning vents",
      "Monitor for pests that thrive in warm weather",
    ],
  },
  {
    season: "Fall",
    icon: "🍂",
    tips: [
      "Gradually reduce watering as growth slows",
      "Stop fertilizing as plants prepare for dormancy",
      "Bring outdoor plants inside before first frost",
      "Increase humidity as heating systems dry the air",
    ],
  },
  {
    season: "Winter",
    icon: "❄️",
    tips: [
      "Water less frequently - plants use less water in winter",
      "Provide extra light with grow lamps if needed",
      "Keep plants away from cold windows and drafts",
      "Be patient - minimal growth is normal",
    ],
  },
];

export default function PlantCareGuide() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Plant Care <span className="text-[#00FF88]">Guide</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know to keep your green friends happy and
            thriving. From beginner basics to advanced techniques, we've got you
            covered.
          </p>
        </div>

        {/* Care Categories */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Essential <span className="text-[#00FF88]">Care Basics</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {careCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={index}
                  className="bg-gray-900/50 border-gray-800 hover:border-[#00FF88]/30 transition-all duration-300 group"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-[#00FF88]/10 rounded-full flex items-center justify-center group-hover:bg-[#00FF88]/20 transition-colors">
                        <Icon className="h-6 w-6 text-[#00FF88]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{category.title}</h3>
                        <p className="text-gray-400">{category.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {category.tips.map((tip, tipIndex) => (
                        <li
                          key={tipIndex}
                          className="flex items-start space-x-3"
                        >
                          <CheckCircle className="h-5 w-5 text-[#00FF88] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 leading-relaxed">
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Plant-Specific Care */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Care by <span className="text-[#00FF88]">Plant Type</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plantTypes.map((plant, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-[#00FF88]/30 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{plant.name}</h3>
                    <Badge
                      variant="outline"
                      className={`
                        ${
                          plant.difficulty === "Beginner"
                            ? "border-green-500 text-green-400"
                            : ""
                        }
                        ${
                          plant.difficulty === "Intermediate"
                            ? "border-yellow-500 text-yellow-400"
                            : ""
                        }
                        ${
                          plant.difficulty === "Advanced"
                            ? "border-red-500 text-red-400"
                            : ""
                        }
                      `}
                    >
                      {plant.difficulty}
                    </Badge>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Watering:</span>
                      <span className="text-[#00FF88]">{plant.watering}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Light:</span>
                      <span className="text-[#00FF88]">{plant.light}</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-[#00FF88] mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {plant.tips}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Common Problems */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-[#00FF88]">Troubleshooting</span> Common
            Issues
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {commonProblems.map((issue, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-[#00FF88]/30 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-[#00FF88]" />
                    <h3 className="text-lg font-bold">{issue.problem}</h3>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      Common Causes:
                    </h4>
                    <ul className="space-y-1">
                      {issue.causes.map((cause, causeIndex) => (
                        <li
                          key={causeIndex}
                          className="text-gray-300 text-sm flex items-center space-x-2"
                        >
                          <div className="w-1.5 h-1.5 bg-[#00FF88] rounded-full"></div>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      Solutions:
                    </h4>
                    <ul className="space-y-1">
                      {issue.solutions.map((solution, solutionIndex) => (
                        <li
                          key={solutionIndex}
                          className="text-gray-300 text-sm flex items-center space-x-2"
                        >
                          <CheckCircle className="w-3 h-3 text-[#00FF88]" />
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Seasonal Care */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-[#00FF88]">Seasonal</span> Care Calendar
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalTips.map((season, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-[#00FF88]/30 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">{season.icon}</div>
                    <h3 className="text-xl font-bold">{season.season}</h3>
                  </div>
                  <ul className="space-y-3">
                    {season.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-[#00FF88] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm leading-relaxed">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Become a{" "}
            <span className="text-[#00FF88]">Plant Parent</span>?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Now that you know the basics, it's time to find your perfect plant
            companion. Browse our collection of healthy, well-cared-for plants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plants">
              <Button className="bg-[#00FF88] text-black hover:bg-[#00FF88]/90 font-semibold px-8 py-4">
                <Leaf className="h-5 w-5 mr-2" />
                Shop Plants Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
