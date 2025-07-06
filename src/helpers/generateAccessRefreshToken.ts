import { User } from "../models/userModels.js";
import ApiError from "../utils/ApiError.js";

interface IToken {
  accessToken: string;
  refreshToken: string;
}

const generateAccessRefreshToken = async (_id: string): Promise<IToken> => {
  const user = await User.findById(_id);

  if (!user) {
    throw new ApiError(false, 404, "User not found");
  }

  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new ApiError(
        false,
        500,
        "Error generating accessToken and refreshToken"
      );
    }

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new ApiError(false, 500, "Error generating tokens", error);
  }
};

export { generateAccessRefreshToken };
