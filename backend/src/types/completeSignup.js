import { z } from "zod";

export const completeSignUpPayload = z.object({
    email: z.string().email({ message: "Invalid email" }),
    otp: z.string().min(1, { message: "OTP is required" })
});
