"use client";

import { useState } from "react";
import {
  ChevronDown,
  Leaf,
  Truck,
  Shield,
  Heart,
  HelpCircle,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const faqData = [
  {
    id: 1,
    question: "How do I know which plants are right for my space?",
    answer:
      "We provide detailed care guides for each plant, including light requirements, space needs, and difficulty level. Our plant finder tool can help match plants to your specific environment - whether you have a sunny balcony, low-light apartment, or spacious garden. Feel free to contact our plant experts for personalized recommendations!",
    icon: Leaf,
  },
  {
    id: 2,
    question: "What's your plant health guarantee?",
    answer:
      "We guarantee all plants arrive healthy and vibrant! If your plant arrives damaged or unhealthy, we'll replace it free of charge within 30 days. We also offer a 14-day care support period where our experts will help you get your new plant settled in its new home.",
    icon: Shield,
  },
  {
    id: 3,
    question: "How do you ensure plants survive shipping?",
    answer:
      "Our plants are carefully packaged with moisture-retaining materials and protective cushioning. We ship Monday-Wednesday to avoid weekend delays, and most orders arrive within 2-3 business days. Each package includes care instructions and our 24/7 plant emergency hotline number.",
    icon: Truck,
  },
  {
    id: 4,
    question: "Do you offer plant care support after purchase?",
    answer:
      "Every purchase includes access to our plant parent community, monthly care newsletters, and free consultations with our horticulturists. We're here to help your plants thrive long after they arrive at your door.",
    icon: Heart,
  },
  {
    id: 5,
    question: "Can I return a plant if it doesn't work out?",
    answer:
      "We understand that sometimes plants and spaces don't match perfectly. You can return any plant within 30 days for a full refund, as long as it's in good health. We'll even help you find a better alternative that suits your needs.",
    icon: Star,
  },
  {
    id: 6,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and offer buy-now-pay-later options through Klarna and Afterpay. All transactions are secured with 256-bit SSL encryption for your peace of mind.",
    icon: HelpCircle,
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Frequently Asked <span className="text-[#00FF88]">Questions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about growing your plant family with
            GROWMOR. Can't find what you're looking for? Our plant experts are
            here to help!
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid gap-4 max-w-4xl mx-auto">
          {faqData.map((item) => {
            const Icon = item.icon;
            const isOpen = openItems.includes(item.id);

            return (
              <Card
                key={item.id}
                className="bg-gray-900/50 border-gray-800 hover:border-[#00FF88]/30 transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#00FF88]/10 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-[#00FF88]" />
                      </div>
                      <h3 className="text-lg font-semibold text-white pr-4">
                        {item.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-[#00FF88] transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#00FF88]/10 to-transparent p-8 rounded-2xl border border-[#00FF88]/20">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-400 mb-6">
              Our plant experts are available 24/7 to help you grow your green
              thumb
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="border border-[#00FF88] text-[#00FF88] px-8 py-3 rounded-lg font-semibold hover:bg-[#00FF88]/10 transition-colors text-center"
              >
                Email Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
