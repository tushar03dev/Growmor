"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // simple email regex validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!isValidEmail(email)) {
      setMessage("❌ Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status >= 200 && res.status < 300) {
        setMessage("✅ Subscribed successfully! 🎉");
        setEmail("");
      } else {
        setMessage(res.data.message || "⚠️ Subscription failed.");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.message) {
        setMessage(`⚠️ ${error.response.data.message}`);
      } else {
        setMessage("⚠️ Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="mb-6">
            Subscribe to receive plant care tips, exclusive offers, and updates
            on new arrivals.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border border-primary-foreground/20 bg-transparent placeholder:text-primary-foreground/70"
              required
              disabled={loading}
            />
            <Button variant="secondary" type="submit" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>

          {message && <p className="mt-4">{message}</p>}
        </div>
      </div>
    </section>
  );
}
