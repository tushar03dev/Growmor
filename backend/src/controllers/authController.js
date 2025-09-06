import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin, User } from "../models/model.js";
import dotenv from "dotenv";
import { passwordResetMail, sendOTP } from "./otpController.js";
import { getRedisClient } from "../config/redis.js";
import { signUpPayload } from "../types/signUp.js";
import { completeSignUpPayload } from "../types/completeSignup.js";
import { signInPayload } from "../types/signIn.js";
import { emailOnlyPayload } from "../types/passwordReset.js";
import { changePasswordPayload } from "../types/changePassword.js";
import zod from "zod";

function flattenZodError(err) {
  return err.flatten().fieldErrors;
}

dotenv.config();

export const signUp = async (req, res, next) => {
  const createPayload = req.body;
  const parsedPayload = signUpPayload.safeParse(createPayload);

  if (!parsedPayload.success) {
    const errors = flattenZodError(parsedPayload.error);
    console.log(errors);
    res.json({ message: "Invalid input", errors });
    return;
  }

  try {
    const existingUser = await User.findOne({ email: createPayload.email });
    if (existingUser) {
      console.debug("User already exists", existingUser);
      res.status(400).json({ errors: "USER_ALREADY_EXISTS" });
      return;
    }

    // Send OTP
    const otp = await sendOTP(createPayload.email);
    if (!otp) {
      res.status(400).json({ errors: "Otp Not Found" });
      return;
    }

    // Store user temporarily in Redis using the OTP token as key
    const tempUserData = JSON.stringify({
      name: createPayload.name,
      password: createPayload.password,
    });
    const redisClient = getRedisClient();
    await redisClient.setEx(`otp:${createPayload.email}`, 300, otp);
    await redisClient.setEx(`signup:${createPayload.email}`, 300, tempUserData); // Expires in 5 minutes

    return res.status(200).json({
      success: true,
      message:
        "OTP sent to your email. Please enter the OTP to complete sign-up.",
    });
  } catch (err) {
    next(err);
  }
};

export const completeSignUp = async (req, res, next) => {
  const createPayload = req.body;
  const parsedPayload = completeSignUpPayload.safeParse(req.body);

  if (!parsedPayload.success) {
    const errorTree = zod.treeifyError(parsedPayload.error);
    res.status(401).json({ message: "Invalid input", errors: errorTree });
    return;
  }

  try {
    const redisClient = getRedisClient();
    const savedOtp = await redisClient.get(`otp:${createPayload.email}`);

    if (savedOtp && createPayload.otp === savedOtp) {
      const userDataStr = await redisClient.get(
        `signup:${createPayload.email}`
      );
      if (!userDataStr) {
        return res
          .status(400)
          .json({ message: "No user data found or token expired." });
      }

      const { name, password } = JSON.parse(userDataStr);

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email: createPayload.email,
        password: hashedPassword,
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { user: user._id, email: createPayload.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      await redisClient.del([
        `signup:${createPayload.email}`,
        `otp:${createPayload.email}`,
      ]); // Clean up Redis entry

      // Respond with token and success message
      res.status(201).json({
        success: true,
        token,
        message: "User signed up successfully.",
      });
    } else {
      // OTP verification failed
      res.status(400).json({ message: "Invalid or expired otp" });
    }
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  const createPayload = req.body;
  const parsedPayload = signInPayload.safeParse(createPayload);

  if (!parsedPayload.success) {
    const errorTree = zod.treeifyError(parsedPayload.error);
    res.status(401).json({ message: "Invalid input", errors: errorTree });
    return;
  }

  try {
    const user = await User.findOne({ email: createPayload.email });
    if (!user) {
      res.status(400).send("User does not exist.");
      return;
    }

    try {
      const user = await User.findOne({ email: createPayload.email });
      if (!user) {
        res.status(400).send("User does not exist.");
        return;
      }

      const isMatch = await bcrypt.compare(
        createPayload.password,
        user.password
      );
      if (!isMatch) {
        res.status(400).send("Invalid password");
        return;
      }

      const token = jwt.sign(
        { user: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({ success: true, token, name: user.name });
    } catch (err) {
      next(err);
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({ success: true, token, name: user.name });
  } catch (err) {
    next(err);
  }
};

export const passwordReset = async (req, res, next) => {
  const createPayload = req.body;
  const parsedPayload = emailOnlyPayload.safeParse(createPayload);

  if (!parsedPayload.success) {
    const errorTree = zod.treeifyError(parsedPayload.error);
    res.status(401).json({ message: "Invalid input", errors: errorTree });
    return;
  }

  try {
    const user = await User.find({ email: createPayload.email });
    if (!user) {
      res.status(400).json({ msg: "User does not exist." });
    }

    const otp = await passwordResetMail(createPayload.email);
    const redisClient = getRedisClient();
    await redisClient.setEx(`otp:${createPayload.email}`, 300, otp);

    res.status(201).json({ success: true, msg: "Otp verification mail sent." });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  const createPayload = req.body;
  const parsedPayload = changePasswordPayload.safeParse(createPayload);

  if (!parsedPayload.success) {
    const errorTree = zod.treeifyError(parsedPayload.error);
    res.status(401).json({ message: "Invalid input", errors: errorTree });
    return;
  }

  try {
    const redisClient = getRedisClient();
    const savedOtp = await redisClient.get(`otp:${createPayload.email}`);

    if (savedOtp && createPayload.otp === savedOtp) {
      const user = await User.find({ email: createPayload.email });
      if (!user) {
        res.status(400).json({ msg: "User does not exist." });
      }

      const hashedPassword = await bcrypt.hash(createPayload.password, 10);
      if (!hashedPassword) {
        res.status(400).send("Invalid password");
      }

      await User.updateOne(
        { email: createPayload.email },
        { password: hashedPassword }
      );
      await redisClient.del(`otp:${createPayload.email}`);

      res.status(200).json({ success: true, msg: "Password updated" });
    } else {
      res.status(400).send("Invalid or Expired OTP");
    }
  } catch (err) {
    next(err);
  }
};

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Invalid email or password");
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (password !== admin.password) {
      console.log(typeof password);
      console.log(typeof admin.password);
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(200).json({ success: true, token, name: admin.name });
  } catch (err) {
    res.status(400).send("Access to Admin Panel Denied");
    next(err);
  }
};
