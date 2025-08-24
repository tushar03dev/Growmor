"use client";

import {
  Leaf,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    details: "+1 (555) 123-GROW",
    subtitle: "Mon-Fri 9AM-6PM EST",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: "hello@growmor.com",
    subtitle: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Visit Our Greenhouse",
    details: "123 Garden Street, Plant City, FL 33563",
    subtitle: "Open for tours by appointment",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon-Fri: 9AM-6PM",
    subtitle: "Sat-Sun: 10AM-4PM EST",
  },
];

const socialLinks = [
  { icon: Instagram, name: "Instagram", handle: "@growmor_plants" },
  { icon: Facebook, name: "Facebook", handle: "GrowmorPlants" },
  { icon: Twitter, name: "Twitter", handle: "@growmor" },
];

export default function Contacts() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Let's <span className="text-[#00FF88]">Grow</span>
            <br />
            Together
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Have questions about plant care? Need help choosing the perfect
            green companion? Our plant experts are here to help you succeed on
            your growing journey.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-[#00FF88]/30 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-[#00FF88]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00FF88]/20 transition-colors">
                    <Icon className="h-6 w-6 text-[#00FF88]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {info.title}
                  </h3>
                  <p className="text-[#00FF88] font-medium mb-1">
                    {info.details}
                  </p>
                  <p className="text-gray-400 text-sm">{info.subtitle}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Form & Info Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-6">
                <MessageCircle className="h-6 w-6 text-[#00FF88]" />
                <h2 className="text-2xl font-bold">Send Us a Message</h2>
              </div>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      First Name
                    </label>
                    <Input
                      className="bg-gray-800 border-gray-700 focus:border-[#00FF88] focus:ring-[#00FF88]"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Last Name
                    </label>
                    <Input
                      className="bg-gray-800 border-gray-700 focus:border-[#00FF88] focus:ring-[#00FF88]"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Email
                  </label>
                  <Input
                    type="email"
                    className="bg-gray-800 border-gray-700 focus:border-[#00FF88] focus:ring-[#00FF88]"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Subject
                  </label>
                  <Input
                    className="bg-gray-800 border-gray-700 focus:border-[#00FF88] focus:ring-[#00FF88]"
                    placeholder="How can we help you?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Message
                  </label>
                  <Textarea
                    className="bg-gray-800 border-gray-700 focus:border-[#00FF88] focus:ring-[#00FF88] min-h-[120px]"
                    placeholder="Tell us about your plant questions or concerns..."
                  />
                </div>
                <Button className="w-full bg-[#00FF88] text-black hover:bg-[#00FF88]/90 font-semibold py-3">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="space-y-8">
            {/* Plant Care Support */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Leaf className="h-5 w-5 text-[#00FF88] mr-2" />
                  Plant Care Support
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Our certified plant specialists are available to help with:
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#00FF88] rounded-full mr-3"></div>
                    Plant identification and care guides
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#00FF88] rounded-full mr-3"></div>
                    Troubleshooting plant health issues
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#00FF88] rounded-full mr-3"></div>
                    Repotting and propagation advice
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#00FF88] rounded-full mr-3"></div>
                    Seasonal care recommendations
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Emergency Plant Care */}
            <Card className="bg-gradient-to-br from-[#00FF88]/10 to-transparent border-[#00FF88]/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 text-[#00FF88]">
                  Emergency Plant Care
                </h3>
                <p className="text-gray-300 mb-4">
                  Plant in crisis? Our emergency hotline is available for urgent
                  plant care situations.
                </p>
                <div className="flex items-center space-x-2 text-[#00FF88] font-semibold">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 911-LEAF</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Available 24/7 for plant emergencies
                </p>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Follow Our Journey</h3>
                <p className="text-gray-300 mb-6">
                  Join our community for daily plant inspiration, care tips, and
                  behind-the-scenes content.
                </p>
                <div className="space-y-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-[#00FF88]" />
                          <span className="font-medium">{social.name}</span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {social.handle}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location Section */}
        <Card className="bg-gray-900/50 border-gray-800 mb-20">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Visit Our <span className="text-[#00FF88]">Greenhouse</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Experience our plants in person at our beautiful greenhouse
                facility. Tours available by appointment.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-[#00FF88] mx-auto mb-4" />
                <p className="text-gray-300 mb-2">123 Garden Street</p>
                <p className="text-gray-300 mb-4">Plant City, FL 33563</p>
                <Button
                  variant="outline"
                  className="border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/10 bg-transparent"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your{" "}
            <span className="text-[#00FF88]">Plant Journey</span>?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Don't wait to transform your space. Browse our collection of
            healthy, beautiful plants ready to find their new home.
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
