import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// ---- Send Message ---- //
export const sendMessage = asyncHandler(async (req, res, next) => {
  const { senderName, subject, message } = req.body;
  if (!senderName || !subject || !message) {
    return next(new ApiError(400, "full Fill Form"));
  }
  const data = await Message.create({ senderName, subject, message });
  res.status(200).json(new ApiResponse(200, "Sent Message Successfully", data));
});

// ---- Get All Messages ---- //
export const getAllMessage = asyncHandler(async (req, res) => {
  const data = await Message.find({});
  res.status(200).json(new ApiResponse(200, "Get All Messages", data));
});

// ---- Delete Message ---- //
export const deleteMessage = asyncHandler(async (req, res,next) => {
  try {
    const { _id } = req.params;
    const message = await Message.findByIdAndDelete( _id );
    if (!message) {
        return next(new ApiError(404, "Message Not Found"));
    }
    res.status(200).json(new ApiResponse(200, "Delete Message !",message));
  } catch (error) {
    console.log(`Delete Message Error ${error}`);
  }
});

// ---- Delete All Messages ---- //
export const deleteAllMessages = asyncHandler(async (req, res,next) => {
  try {
    const message = await Message.deleteMany();
    if (!message) {
        return next(new ApiError(404, "Message Not Found"));
    }
    res.status(200).json(new ApiResponse(200, "Delete Message All Messages !",message));
  } catch (error) {
    console.log(`Delete Message Error ${error}`);
  }
});