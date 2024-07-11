import { Router } from "express";
import { deleteAllMessages, deleteMessage, getAllMessage, sendMessage } from "../controllers/message.controller.js";
import { authenticated } from "../middleware/auth.js";

const router = Router()

router.route('/sent-message').post(sendMessage)
router.route('/get-message').get(getAllMessage)
router.route('/delete-message/:_id').delete(authenticated,deleteMessage)
router.route('/delete-all-message').delete(authenticated,deleteAllMessages)

export default router