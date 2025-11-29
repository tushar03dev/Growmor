import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { passwordResetMail, sendOTP } from "./otpController.js";
import { getRedisClient } from "../config/redis.js";
import { signUpPayload } from "../types/signUp.js";
import { completeSignUpPayload } from "../types/completeSignup.js";
import { signInPayload } from "../types/signIn.js";
import { emailOnlyPayload } from "../types/passwordReset.js";
import { changePasswordPayload } from "../types/changePassword.js";
import zod from "zod";
import {PrismaClient} from "@prisma/client";

function flattenZodError(err) {
  return err.flatten().fieldErrors;
}

dotenv.config();

const prisma = new PrismaClient();

export const signUp = async (req, res, next) => {
  console.log("signUp: incoming request", req.body);
  const createPayload = req.body;
  const parsedPayload = signUpPayload.safeParse(createPayload);

  if (!parsedPayload.success) {
    const errors = flattenZodError(parsedPayload.error);
    console.log("signUp: validation failed", errors);
    res.json({ message: "Invalid input", errors });
    return;
  }

  try {
    console.log("signUp: checking existing user");
    const existingUser = await prisma.user.findUnique({
      where: { email: createPayload.email },
    });

    if (existingUser) {
      console.log("signUp: user already exists", existingUser.email);
      res.status(400).json({ errors: "USER_ALREADY_EXISTS" });
      return;
    }

    console.log("signUp: sending OTP");
    const otp = await sendOTP(createPayload.email);

    if (!otp) {
      console.log("signUp: OTP generation failed");
      res.status(400).json({ errors: "Otp Not Found" });
      return;
    }

    console.log("signUp: storing OTP and temp user data in Redis");
    const tempUserData = JSON.stringify({
      name: createPayload.name,
      password: createPayload.password,
    });

    const redisClient = getRedisClient();

    await redisClient.setEx(`otp:${createPayload.email}`, 300, otp);
    await redisClient.setEx(`signup:${createPayload.email}`, 300, tempUserData);

    console.log("signUp: OTP sent and Redis storage complete");

    return res.status(200).json({
      success: true,
      message:
          "OTP sent to your email. Please enter the OTP to complete sign-up.",
    });
  } catch (err) {
    console.log("signUp: error occurred", err);
    next(err);
  }
};

export const completeSignUp = async (req, res, next) => {
  console.log("completeSignUp: incoming request", req.body);
  const createPayload = req.body;
  const parsedPayload = completeSignUpPayload.safeParse(req.body);

  if (!parsedPayload.success) {
    const errorTree = zod.treeifyError(parsedPayload.error);
    console.log("completeSignUp: validation failed", errorTree);
    res.status(401).json({ message: "Invalid input", errors: errorTree });
    return;
  }

  try {
    const redisClient = getRedisClient();
    console.log("completeSignUp: fetching OTP from Redis");

    const savedOtp = await redisClient.get(`otp:${createPayload.email}`);

    if (savedOtp && createPayload.otp === savedOtp) {
      console.log("completeSignUp: OTP matched");

      const userDataStr = await redisClient.get(
          `signup:${createPayload.email}`
      );

      if (!userDataStr) {
        console.log("completeSignUp: no user data found in Redis");
        return res
            .status(400)
            .json({ message: "No user data found or token expired." });
      }

      const { name, password } = JSON.parse(userDataStr);
      console.log("completeSignUp: creating user in database");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data:{name: name, email:createPayload.email, password: hashedPassword},
      });
      console.log("completeSignUp: user saved");

      const token = jwt.sign(
          { user: user._id, email: createPayload.email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
      );

      console.log("completeSignUp: JWT generated");

      await redisClient.del([
        `signup:${createPayload.email}`,
        `otp:${createPayload.email}`,
      ]);

      console.log("completeSignUp: Redis cleanup done");

      res.status(201).json({
        success: true,
        token,
        message: "User signed up successfully.",
      });
    } else {
      console.log("completeSignUp: OTP mismatch or expired");
      res.status(400).json({ message: "Invalid or expired otp" });
    }
  } catch (err) {
    console.log("completeSignUp: error occurred", err);
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  console.log("signIn: incoming request", req.body);
  const createPayload = req.body;
  const parsedPayload = signInPayload.safeParse(createPayload);

  if (!parsedPayload.success) {
    const errorTree = zod.treeifyError(parsedPayload.error);
    console.log("signIn: validation failed", errorTree);
    res.status(401).json({ message: "Invalid input", errors: errorTree });
    return;
  }

  try {
    console.log("signIn: fetching user");
    const user = await prisma.user.findUnique({
      where: { email: createPayload.email },
    });

    if (!user) {
      console.log("signIn: user does not exist");
      res.status(400).send("User does not exist.");
      return;
    }

    console.log("signIn: comparing password");
    const isMatch = await bcrypt.compare(
        createPayload.password,
        user.password
    );

    if (!isMatch) {
      console.log("signIn: password mismatch");
      res.status(400).send("Invalid password");
      return;
    }

    console.log("signIn: generating JWT");
    const token = jwt.sign(
        { user: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    console.log("signIn: login successful");

    return res.json({ success: true, token, name: user.name });
  } catch (err) {
    console.log("signIn: error occurred", err);
    next(err);
  }
};

export const passwordReset = async (req, res, next) => {
  console.log("passwordReset: incoming request", req.body);
  const createPayload = req.body;
  const parsedPayload = emailOnlyPayload.safeParse(createPayload);

  if (!parsedPayload.success) {
    const errorTree = zod.treeifyError(parsedPayload.error);
    console.log("passwordReset: validation failed", errorTree);
    res.status(401).json({ message: "Invalid input", errors: errorTree });
    return;
  }

  try {
    console.log("passwordReset: checking user existence");
    const user = await prisma.user.findUnique({
        where: { email: createPayload.email },
    });

    if (!user) {
      console.log("passwordReset: user not found");
      res.status(400).json({ msg: "User does not exist." });
    }

    console.log("passwordReset: sending OTP mail");
    const otp = await passwordResetMail(createPayload.email);

    const redisClient = getRedisClient();
    await redisClient.setEx(`otp:${createPayload.email}`, 300, otp);

    console.log("passwordReset: OTP stored in Redis");

    res.status(201).json({ success: true, msg: "Otp verification mail sent." });
  } catch (err) {
    console.log("passwordReset: error occurred", err);
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  console.log("changePassword: incoming request", req.body);
  const createPayload = req.body;
  const parsedPayload = changePasswordPayload.safeParse(createPayload);

  if (!parsedPayload.success) {
    const errorTree = zod.treeifyError(parsedPayload.error);
    console.log("changePassword: validation failed", errorTree);
    res.status(401).json({ message: "Invalid input", errors: errorTree });
    return;
  }

  try {
    console.log("changePassword: fetching OTP from Redis");
    const redisClient = getRedisClient();
    const savedOtp = await redisClient.get(`otp:${createPayload.email}`);

    if (savedOtp && createPayload.otp === savedOtp) {
      console.log("changePassword: OTP matched");

      const user = await prisma.user.findUnique({
        where: { email: createPayload.email }
      });

      if (!user) {
        console.log("changePassword: user does not exist");
        res.status(400).json({ msg: "User does not exist." });
      }

      console.log("changePassword: hashing password");
      const hashedPassword = await bcrypt.hash(createPayload.password, 10);

      await prisma.user.update({
        where: { email: createPayload.email },
        data: {password: hashedPassword},
      });

      console.log("changePassword: password updated");

      await redisClient.del(`otp:${createPayload.email}`);
      console.log("changePassword: Redis OTP deleted");

      res.status(200).json({ success: true, msg: "Password updated" });
    } else {
      console.log("changePassword: OTP mismatch or expired");
      res.status(400).send("Invalid or Expired OTP");
    }
  } catch (err) {
    console.log("changePassword: error occurred", err);
    next(err);
  }
};

export const adminLogin = async (req, res, next) => {
  console.log("adminLogin: incoming request", req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("adminLogin: invalid input");
    return res.status(400).send("Invalid email or password");
  }

  try {
    console.log("adminLogin: checking admin");
    const admin = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!admin) {
      console.log("adminLogin: admin not found");
      return res.status(401).json({ message: "Invalid email" });
    }

    if (password !== admin.password) {
      console.log("adminLogin: password mismatch");
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("adminLogin: generating JWT");
    const token = jwt.sign(
        { id: admin._id, email: admin.email, isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
    );

    console.log("adminLogin: login successful");

    res.status(200).json({ success: true, token, name: admin.name });
  } catch (err) {
    console.log("adminLogin: error occurred", err);
    res.status(400).send("Access to Admin Panel Denied");
    next(err);
  }
};
