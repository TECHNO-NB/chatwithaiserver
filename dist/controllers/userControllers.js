import { generateAccessRefreshToken } from "../helpers/generateAccessRefreshToken.js";
import { User } from "../models/userModels.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/resendConfig.js";
const options = {
    domain: "localhost",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
const signupController = asyncHandler(async (req, res) => {
    const { email, password } = req?.body;
    if (!email || !password) {
        throw new ApiError(false, 400, "Email and password are required");
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            throw new ApiError(false, 400, "Password is incorrect");
        }
        if (!existingUser.isVerified) {
            throw new ApiError(false, 400, "User is not verified");
        }
        const { accessToken, refreshToken } = await generateAccessRefreshToken(existingUser._id);
        if (!accessToken || !refreshToken) {
            throw new ApiError(false, 500, "Failed to generate access token");
        }
        const loginUser = await User.findById(existingUser._id).select("-password");
        if (!loginUser) {
            throw new ApiError(false, 500, "Failed to find user");
        }
        return (res
            .status(200)
            // @ts-ignore
            .cookie("accessToken", accessToken, options)
            // @ts-ignore
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(true, 200, "User login successfully", loginUser)));
    }
    // User does not exist, proceed with registration
    const username = email.split("@")[0];
    const verifiedCode = Math.floor(100000 + Math.random() * 900000);
    const user = await User.create({
        username,
        email,
        password,
        verifiedCode,
    });
    if (!user) {
        throw new ApiError(false, 500, "Failed to create user");
    }
    // Registration successful, respond to client immediately
    res
        .status(201)
        .json(new ApiResponse(true, 201, "User registered successfully", user));
    try {
        const emailData = await sendEmail(email, "Email Verification Code", verifiedCode);
        if (emailData) {
            console.log("Verification email sent successfully", emailData);
        }
        else {
            console.error("Failed to send verification email");
        }
    }
    catch (error) {
        console.error("Error sending verification email:", error);
    }
});
// verfiy email address
const verifyEmail = asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        throw new ApiError(false, 400, "Code is required");
    }
    const user = await User.findOne({ verifiedCode: parseInt(code) }).select("-password");
    if (!user) {
        throw new ApiError(false, 400, "Invalid code");
    }
    user.isVerified = true;
    user.verifiedCode = undefined;
    const verifiedUser = await user.save();
    if (!verifiedUser) {
        throw new ApiError(false, 500, "Error on verify user");
    }
    const { accessToken, refreshToken } = await generateAccessRefreshToken(verifiedUser._id);
    if (!accessToken || !refreshToken) {
        throw new ApiError(false, 500, "Error on generate token");
    }
    return (res
        .status(200)
        // @ts-ignore
        .cookie("accessToken", accessToken, options)
        // @ts-ignore
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(true, 200, "Email verified successfully", verifiedUser)));
});
const loginWithGoogle = asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        throw new ApiError(false, 400, "Token is required");
    }
    const existingUser = await User.findOne({ email: token.email }).select("-password");
    if (existingUser) {
        const { accessToken, refreshToken } = await generateAccessRefreshToken(existingUser._id);
        if (!accessToken || !refreshToken) {
            throw new ApiError(false, 500, "Error on generate token");
        }
        return (res
            .status(200)
            // @ts-ignore
            .cookie("accessToken", accessToken, options)
            // @ts-ignore
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(true, 200, "Login successfully", existingUser)));
    }
    else {
        const user = await User.create({
            username: token.name,
            email: token.email,
            isVerified: true,
        });
        if (!user) {
            throw new ApiError(false, 500, "Error on create user");
        }
        const findUser = await User.findOne({ email: token.email }).select("-password");
        if (!findUser) {
            throw new ApiError(false, 500, "Error on find user");
        }
        const { accessToken, refreshToken } = await generateAccessRefreshToken(findUser._id);
        if (!accessToken || !refreshToken) {
            throw new ApiError(false, 500, "Error on generate token");
        }
        return (res
            .status(200)
            // @ts-ignore
            .cookie("accessToken", accessToken, options)
            // @ts-ignore
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(true, 200, "Login successfully", findUser)));
    }
});
const verfiyUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id) {
        throw new ApiError(false, 401, "User is not login yet!");
    }
    const findUser = await User.findById(_id).select("-password");
    if (!findUser) {
        throw new ApiError(false, 500, "Error on find user");
    }
    return res
        .status(200)
        .json(new ApiResponse(true, 200, "User verify successfully", findUser));
});
const upgradePlan = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(false, 401, "User is not login yet!");
    }
    const findUser = await User.findById(id, {
        $set: {
            isPremium: true,
        },
    }).select("-password");
    if (!findUser) {
        throw new ApiError(false, 500, "Error on find user");
    }
    return res
        .status(200)
        .json(new ApiResponse(true, 200, "User upgrade plan successfully", findUser));
});
export { signupController, verifyEmail, loginWithGoogle, verfiyUser, upgradePlan, };
