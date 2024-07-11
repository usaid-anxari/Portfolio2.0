import { User } from "../models/user.model.js";
import 'dotenv/config'
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const authenticated = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token || undefined) {
    return res.status(404).json(404,"Pleas Login First!")
  }

  const decoded = jwt.verify(token,process.env.JWT_SECRET_TOKEN)
  req.user = await User.findById(decoded.id);
  next();
});
