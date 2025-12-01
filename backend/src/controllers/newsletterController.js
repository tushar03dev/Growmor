import prisma from "../utils/prisma.js";
import { newsletterSchema } from "../types/email.js";


export const unsubscribeNewsletter = async (req, res) => {
  try {
    console.log("unsubscribeNewsletter");

    const result = newsletterSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: result.error.errors[0].message
      });
    }

    const { email } = result.data;

    const existing = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (!existing) {
      console.log("email not found", email);
      return res.status(404).json({ message: "Email not subscribed" });
    }

    await prisma.newsletter.delete({
      where: { email }
    });

    console.log("unsubscribed", email);
    res.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.log("unsubscribeNewsletter error", error);
    res.status(500).json({ message: "Server error" });
  }
};
