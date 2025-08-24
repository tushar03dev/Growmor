import { Newsletter } from "../models/model.js";
import { newsletterSchema } from "../types/email.js";

// POST /api/newsletter/subscribe
export const subscribeNewsletter = async (req, res) => {
  try {
    // validate request body
    const result = newsletterSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: result.error.errors[0].message, // send first error
      });
    }

    const { email } = result.data;

    // check if email already exists
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Error subscribing newsletter:", error);
    res.status(500).json({ message: "Server error" });
  }
};
