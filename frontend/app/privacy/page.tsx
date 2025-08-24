"use client";

import {
  Leaf,
  Shield,
  Eye,
  Lock,
  Users,
  Mail,
  Phone,
  CreditCard,
  Globe,
  AlertCircle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const privacySections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: [
      "Personal information you provide (name, email, phone, shipping address)",
      "Payment information processed securely through our payment partners",
      "Plant care preferences and purchase history to improve recommendations",
      "Website usage data and cookies to enhance your browsing experience",
      "Communication preferences for plant care tips and promotional offers",
    ],
  },
  {
    icon: Shield,
    title: "How We Use Your Information",
    content: [
      "Process and fulfill your plant orders and delivery arrangements",
      "Provide personalized plant care guidance and recommendations",
      "Send important updates about your orders and account",
      "Improve our website functionality and user experience",
      "Comply with legal obligations and prevent fraudulent activities",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      "Industry-standard SSL encryption for all data transmission",
      "Secure payment processing through PCI-compliant partners",
      "Regular security audits and vulnerability assessments",
      "Limited access to personal data on a need-to-know basis",
      "Secure data storage with regular backups and monitoring",
    ],
  },
  {
    icon: Users,
    title: "Information Sharing",
    content: [
      "We never sell your personal information to third parties",
      "Shipping partners receive only necessary delivery information",
      "Payment processors handle transaction data securely",
      "Plant care experts may access your preferences to provide better service",
      "Legal authorities only when required by law or to protect our rights",
    ],
  },
];

const dataTypes = [
  {
    category: "Account Information",
    icon: Users,
    items: [
      "Name and contact details",
      "Account preferences",
      "Login credentials",
    ],
    retention: "Until account deletion",
  },
  {
    category: "Order Information",
    icon: CreditCard,
    items: ["Purchase history", "Payment details", "Shipping addresses"],
    retention: "7 years for tax purposes",
  },
  {
    category: "Plant Care Data",
    icon: Leaf,
    items: ["Plant preferences", "Care schedules", "Growth tracking"],
    retention: "Until you opt out",
  },
  {
    category: "Communication",
    icon: Mail,
    items: [
      "Email correspondence",
      "Support tickets",
      "Newsletter subscriptions",
    ],
    retention: "3 years or until unsubscribed",
  },
];

const userRights = [
  {
    right: "Access Your Data",
    description: "Request a copy of all personal information we have about you",
    action: "Contact our privacy team",
  },
  {
    right: "Correct Information",
    description: "Update or correct any inaccurate personal information",
    action: "Update in your account settings",
  },
  {
    right: "Delete Your Data",
    description:
      "Request deletion of your personal information (with some exceptions)",
    action: "Submit deletion request",
  },
  {
    right: "Data Portability",
    description: "Receive your data in a structured, machine-readable format",
    action: "Request data export",
  },
  {
    right: "Opt-Out",
    description: "Unsubscribe from marketing communications at any time",
    action: "Use unsubscribe links or contact us",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Privacy <span className="text-[#00FF88]">Policy</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Your privacy is as important to us as the health of your plants.
            Learn how we protect and use your information to provide the best
            plant care experience.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-8">
            <Calendar className="h-5 w-5 text-[#00FF88]" />
            <span className="text-gray-400">
              Last updated: December 15, 2024
            </span>
          </div>
        </div>

        {/* Privacy Overview */}
        <Card className="bg-gradient-to-br from-[#00FF88]/10 to-transparent border-[#00FF88]/20 mb-20">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <Shield className="h-8 w-8 text-[#00FF88]" />
              <h2 className="text-2xl font-bold">Our Privacy Commitment</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Lock className="h-12 w-12 text-[#00FF88] mx-auto mb-4" />
                <h3 className="font-bold mb-2">Secure by Design</h3>
                <p className="text-gray-300 text-sm">
                  Your data is protected with enterprise-grade security measures
                </p>
              </div>
              <div className="text-center">
                <Eye className="h-12 w-12 text-[#00FF88] mx-auto mb-4" />
                <h3 className="font-bold mb-2">Transparent Practices</h3>
                <p className="text-gray-300 text-sm">
                  Clear information about what we collect and how we use it
                </p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-[#00FF88] mx-auto mb-4" />
                <h3 className="font-bold mb-2">Your Control</h3>
                <p className="text-gray-300 text-sm">
                  Full control over your personal information and preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-[#00FF88]">Privacy</span> Details
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {privacySections.map((section, index) => {
              const Icon = section.icon;
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
                      <h3 className="text-xl font-bold">{section.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start space-x-3"
                        >
                          <CheckCircle className="h-5 w-5 text-[#00FF88] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 leading-relaxed">
                            {item}
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

        {/* Data Types */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Data <span className="text-[#00FF88]">Categories</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card
                  key={index}
                  className="bg-gray-900/50 border-gray-800 hover:border-[#00FF88]/30 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Icon className="h-6 w-6 text-[#00FF88]" />
                      <h3 className="font-bold">{type.category}</h3>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {type.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-gray-300 text-sm flex items-center space-x-2"
                        >
                          <div className="w-1.5 h-1.5 bg-[#00FF88] rounded-full"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-[#00FF88]" />
                        <span className="text-xs text-gray-400">
                          Retained: {type.retention}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* User Rights */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Your <span className="text-[#00FF88]">Rights</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRights.map((right, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-[#00FF88]/30 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-[#00FF88]">
                    {right.right}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {right.description}
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#00FF88]" />
                      <span className="text-xs text-gray-400">
                        {right.action}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cookies & Tracking */}
        <Card className="bg-gray-900/50 border-gray-800 mb-20">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <Globe className="h-8 w-8 text-[#00FF88]" />
              <h2 className="text-2xl font-bold">Cookies & Tracking</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-[#00FF88]">
                  Essential Cookies
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-[#00FF88] mt-1" />
                    <span className="text-gray-300 text-sm">
                      Shopping cart functionality
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-[#00FF88] mt-1" />
                    <span className="text-gray-300 text-sm">
                      User authentication
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-[#00FF88] mt-1" />
                    <span className="text-gray-300 text-sm">
                      Security and fraud prevention
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4 text-[#00FF88]">
                  Optional Cookies
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-1" />
                    <span className="text-gray-300 text-sm">
                      Analytics and performance tracking
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-1" />
                    <span className="text-gray-300 text-sm">
                      Personalized plant recommendations
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-1" />
                    <span className="text-gray-300 text-sm">
                      Marketing and advertising
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-[#00FF88]/10 rounded-lg">
              <p className="text-gray-300 text-sm">
                You can manage your cookie preferences at any time through your
                browser settings or our cookie preference center.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Updates */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <Mail className="h-8 w-8 text-[#00FF88]" />
                <h2 className="text-2xl font-bold">Privacy Questions?</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Our privacy team is here to help with any questions about your
                data or this policy.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#00FF88]" />
                  <span className="text-gray-300">privacy@growmor.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#00FF88]" />
                  <span className="text-gray-300">1-800-GROWMOR</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <AlertCircle className="h-8 w-8 text-[#00FF88]" />
                <h2 className="text-2xl font-bold">Policy Updates</h2>
              </div>
              <p className="text-gray-300 mb-6">
                We may update this privacy policy to reflect changes in our
                practices or legal requirements.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00FF88] mt-1" />
                  <span className="text-gray-300 text-sm">
                    Email notifications for major changes
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00FF88] mt-1" />
                  <span className="text-gray-300 text-sm">
                    30-day notice for significant updates
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00FF88] mt-1" />
                  <span className="text-gray-300 text-sm">
                    Updated date clearly displayed
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
