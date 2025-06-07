import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Leaf, Users, Heart, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-growmor-green-pale py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-growmor-green-dark mb-6">
                About Growmor Plant Haven
              </h1>
              <p className="text-lg text-gray-600">
                Bringing nature's beauty into your home with carefully curated plants and expert care guidance.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-growmor-green-dark mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2020, Growmor Plant Haven began with a simple mission: to make plant parenthood accessible and enjoyable for everyone. What started as a small local nursery has grown into a beloved destination for plant enthusiasts across the country.
                </p>
                <p className="text-gray-600">
                  Our journey is rooted in a deep passion for plants and a commitment to helping people create their own green sanctuaries at home. We believe that everyone deserves to experience the joy and benefits of living with plants.
                </p>
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src="/images/about/store.jpg"
                  alt="Our Plant Store"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-growmor-green-dark text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-growmor-green-pale rounded-lg flex items-center justify-center mb-6">
                  <Leaf className="w-6 h-6 text-growmor-green-dark" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Sustainability</h3>
                <p className="text-gray-600">
                  We're committed to eco-friendly practices, from sustainable sourcing to recyclable packaging.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-growmor-green-pale rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-growmor-green-dark" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community</h3>
                <p className="text-gray-600">
                  Building a supportive community of plant lovers through workshops and events.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-growmor-green-pale rounded-lg flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-growmor-green-dark" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Quality Care</h3>
                <p className="text-gray-600">
                  Ensuring every plant receives the best care and attention before reaching your home.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-growmor-green-dark text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Founder & Plant Expert',
                  image: '/images/team/sarah.jpg'
                },
                {
                  name: 'Michael Chen',
                  role: 'Head Horticulturist',
                  image: '/images/team/michael.jpg'
                },
                {
                  name: 'Emma Rodriguez',
                  role: 'Customer Care Specialist',
                  image: '/images/team/emma.jpg'
                },
                {
                  name: 'David Kim',
                  role: 'Plant Care Specialist',
                  image: '/images/team/david.jpg'
                }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="aspect-square rounded-full overflow-hidden mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="bg-growmor-green-pale py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-growmor-green-dark" />
                </div>
                <h3 className="text-3xl font-bold text-growmor-green-dark mb-2">10K+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-growmor-green-dark" />
                </div>
                <h3 className="text-3xl font-bold text-growmor-green-dark mb-2">500+</h3>
                <p className="text-gray-600">Plant Varieties</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-growmor-green-dark" />
                </div>
                <h3 className="text-3xl font-bold text-growmor-green-dark mb-2">50+</h3>
                <p className="text-gray-600">Workshops Conducted</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-growmor-green-dark" />
                </div>
                <h3 className="text-3xl font-bold text-growmor-green-dark mb-2">15+</h3>
                <p className="text-gray-600">Awards Won</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
