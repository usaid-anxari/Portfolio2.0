import express from "express";
import {upload} from '../middleware/multer.middleware.js'
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { authenticated } from "../middleware/auth.js";


const router = express();

router.route('/register-user').post(upload.fields([
    {name:'avatar',maxCount:1},
    {name:'resume',maxCount:1},
]),registerUser)
router.route("/login-user").post(loginUser)
router.route("/logout-user").get(authenticated,logoutUser)



export default router