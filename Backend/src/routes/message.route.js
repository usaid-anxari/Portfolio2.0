import { Router } from "express";
import { getAllMessage, sendMessage } from "../controllers/message.controller.js";

const router = Router()

router.route('/sent-message').post(sendMessage)
router.route('/get-message').post(getAllMessage)

export default router