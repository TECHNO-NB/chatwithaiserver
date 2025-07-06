import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModels.js";
const jwtVerify = async (req, res, next) => {
    try {
        const { refreshToken, accessToken } = req.cookies;
        if (!refreshToken || !accessToken) {
            return next(new ApiError(false, 401, "Unauthorized request"));
        }
        const decodeAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodeAccessToken._id).select("-password");
        if (!user || user.refreshToken !== refreshToken) {
            return next(new ApiError(false, 401, "Unauthorized request"));
        }
        const decodeRefreshToken = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decodeRefreshToken) {
            return next(new ApiError(false, 401, "Unauthorized request"));
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        next(new ApiError(false, 401, "Unauthorized request"));
    }
};
export { jwtVerify };
