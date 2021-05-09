import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import randToken from "rand-token";

import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't not exist" });
    }

    //compare password
    const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //Jwt Authentication
    const refreshToken = jwt.sign({ email: existingUser.email }, "test", { expiresIn: "1d" });
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "test", { expiresIn: "10s" });

    //save refresh and fresh token to db.
    if (!existingUser.refreshToken) {
      await User.findOneAndUpdate({ email: existingUser.email }, { refreshToken });
    }

    // let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
    //check refresh token
    return res.status(200).json({ result: existingUser, token, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password don't match" });
    }
    const hasedPassword = await bcryptjs.hash(password, 12);

    //Jwt Authentication
    const refreshToken = jwt.sign({ email: email }, "test", { expiresIn: "1d" });

    const result = await User.create({
      email,
      password: hasedPassword,
      name: `${firstName} ${lastName}`,
      refreshToken,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "10s",
    });

    return res.status(200).json({ result, token, refreshToken });
  } catch (error) {
    console.log("error sign up", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const refreshToken = async (req, res) => {
  const refreshTokenFromBody = req.body.refreshToken;
  if (refreshTokenFromBody) {
    try {
      const decodedData = jwt.verify(refreshTokenFromBody, "test");
      const existingUser = await User.findOne({ email: decodedData.email });
      if (existingUser) {
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "test", { expiresIn: "10s" });
        return res.status(200).json({ token });
      }
      // if refresh token don't exist in user info.
      throw new Error("Invalid request in fresh Token");
    } catch (error) {
      console.log("error fresh token", error);
      return res.status(403).json({
        message: "Invalid request in fresh Token",
      });
    }
  } else {
    console.log("error fresh token", error);
    res.status(403).send.json({ message: "Invalid request in fresh Token, fresh token is undefined" });
  }
};
