import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


// ---- Send Message ---- //
export const sendMessage = asyncHandler(async(req,res,next)=>{
    const {senderName,subject,message} =req.body;
    if (!senderName|| !subject|| !message) {
       throw new ApiError(400,'full Fill Form')
    }
    const data = await Message.create({senderName,subject,message})
    res.status(200).json(new ApiResponse(200,"Sent Message Successfully",data))
})

// ---- Get All Messages ---- //
export const getAllMessage = asyncHandler(async(req,res,next)=>{
    const data = await Message.find({})
    res.status(200).json(new ApiResponse(200,"Sent Message Successfully",data))
})


// ---- Delete Message ---- // 
export const deleteMessage = asyncHandler
 
// ---- Delete All Messages ---- //