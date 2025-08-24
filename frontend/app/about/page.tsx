"use client";

import {
  Leaf,
  Users,
  Award,
  Heart,
  Shield,
  Star,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const stats = [
  { number: "50K+", label: "Happy Plant Parents", icon: Users },
  { number: "500+", label: "Plant Varieties", icon: Leaf },
  { number: "98%", label: "Survival Rate", icon: Shield },
  { number: "5 Years", label: "Growing Together", icon: Award },
];

const values = [
  {
    icon: Heart,
    title: "Plant Passion",
    description:
      "Every plant is hand-selected with love and care by our expert horticulturists who share your passion for green living.",
  },
  {
    icon: Shield,
    title: "Quality Promise",
    description:
      "We guarantee healthy, vibrant plants that arrive ready to thrive in their new homes with our 30-day health guarantee.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Join thousands of plant parents in our supportive community where everyone grows together, sharing tips and celebrating successes.",
  },
  {
    icon: Star,
    title: "Expert Support",
    description:
      "Our certified plant specialists provide ongoing care guidance, ensuring your green friends flourish for years to come.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Growing <span className="text-[#00FF88]">Dreams</span>,<br />
            One Plant at a Time
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Founded by plant enthusiasts for plant lovers, GROWMOR transforms
            spaces and lives through the power of greenery. We believe every
            home deserves the joy, beauty, and wellness that plants bring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#00FF88] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#00FF88]/90 transition-all duration-300 flex items-center justify-center space-x-2">
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border border-[#00FF88] text-[#00FF88] px-8 py-4 rounded-lg font-semibold hover:bg-[#00FF88]/10 transition-colors">
              Meet Our Team
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-[#00FF88]/30 transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-[#00FF88]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-[#00FF88]" />
                  </div>
                  <div className="text-3xl font-bold text-[#00FF88] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Our <span className="text-[#00FF88]">Story</span>
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                It all started in a tiny apartment with one struggling
                succulent. Our founder, Sarah, was determined to keep it alive
                despite having what she called "the blackest thumb in the city."
                Through countless hours of research, failed attempts, and small
                victories, she discovered the transformative power of plants.
              </p>
              <p>
                What began as a personal journey became a mission to help others
                experience the same joy and growth. GROWMOR was born from the
                belief that everyone can be a plant parent – they just need the
                right guidance, quality plants, and a supportive community.
              </p>
              <p>
                Today, we're proud to be the trusted partner for over 50,000
                plant parents worldwide, helping transform homes, offices, and
                lives one plant at a time.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-[#00FF88]/20 to-transparent p-8 rounded-2xl border border-[#00FF88]/20">
              <img
                src="/happy-woman-surrounded-by-beautiful-houseplants-in.png"
                alt="Our founder with plants"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              What We <span className="text-[#00FF88]">Stand For</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our values guide everything we do, from selecting the perfect
              plants to supporting your growing journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="bg-gray-900/50 border-gray-800 hover:border-[#00FF88]/30 transition-all duration-300 group"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#00FF88]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#00FF88]/20 transition-colors">
                        <Icon className="h-6 w-6 text-[#00FF88]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3 text-white">
                          {value.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mission Section */}
        <div className="text-center mb-20">
          <div className="bg-gradient-to-r from-[#00FF88]/10 via-[#00FF88]/5 to-transparent p-12 rounded-2xl border border-[#00FF88]/20">
            <h2 className="text-4xl font-bold mb-6">
              Our <span className="text-[#00FF88]">Mission</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              To make plant parenthood accessible, enjoyable, and successful for
              everyone. We're not just selling plants – we're cultivating a
              greener, healthier, and more connected world, one home at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-[#00FF88]/10 text-[#00FF88] px-4 py-2 rounded-full text-sm font-medium">
                Sustainable Growing
              </span>
              <span className="bg-[#00FF88]/10 text-[#00FF88] px-4 py-2 rounded-full text-sm font-medium">
                Expert Care
              </span>
              <span className="bg-[#00FF88]/10 text-[#00FF88] px-4 py-2 rounded-full text-sm font-medium">
                Community Support
              </span>
              <span className="bg-[#00FF88]/10 text-[#00FF88] px-4 py-2 rounded-full text-sm font-medium">
                Quality Promise
              </span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to <span className="text-[#00FF88]">Grow</span> with Us?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our thriving community of plant parents and discover the joy of
            growing your own green paradise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/plants"
              className="bg-[#00FF88] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#00FF88]/90 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Shop Plants</span>
              <Leaf className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
