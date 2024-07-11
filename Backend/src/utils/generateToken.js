import "dotenv/config";

export const generateToken = async (user, message, statusCode, res) => {
  const token = user.generateAccessToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_TOKEN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
