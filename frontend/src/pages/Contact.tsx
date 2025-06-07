import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />
      <main className="flex-grow">
        <section className="container-custom py-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Contact Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-growmor-green-dark mb-4">Contact Us</h1>
              <p className="text-gray-700 mb-8 max-w-md">
                We'd love to hear from you! Whether you have questions about our plants, need advice on plant care, or want to provide feedback, our team is here to help.
              </p>
              <div className="space-y-6 text-[16px]">
                <div>
                  <span className="font-semibold">Address</span>
                  <div className="text-gray-700">123 Garden Street<br />Green City, GC 12345<br />India</div>
                </div>
                <div>
                  <span className="font-semibold">Phone</span>
                  <div className="text-gray-700">+91 1234567890</div>
                </div>
                <div>
                  <span className="font-semibold">Email</span>
                  <div className="text-gray-700">info@greenoasis.com</div>
                </div>
                <div>
                  <span className="font-semibold">Business Hours</span>
                  <div className="text-gray-700">
                    Monday - Friday: 9am - 6pm<br />
                    Saturday: 10am - 4pm<br />
                    Sunday: Closed
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Contact Form */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
              <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input id="name" type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-growmor-green-dark" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input id="email" type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-growmor-green-dark" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input id="subject" type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-growmor-green-dark" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea id="message" rows={4} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-growmor-green-dark"></textarea>
                </div>
                <Button type="submit" className="w-full bg-growmor-green-dark hover:bg-growmor-green-dark/90">Send Message</Button>
              </form>
            </div>
          </div>
        </section>
        {/* Map Section */}
        <section className="container-custom pb-16">
          <h2 className="text-xl font-semibold mb-4">Find Us</h2>
          <div className="bg-gray-100 rounded-lg flex items-center justify-center h-56 md:h-64">
            <span className="text-gray-500">Map would be embedded here</span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
