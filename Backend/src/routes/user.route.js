import express from "express";
import {upload} from '../middleware/multer.middleware.js'
import { getUser, loginUser, logoutUser, registerUser, updateUserAvatar, updateUserInfo, updateUserResume } from "../controllers/user.controller.js";
import { authenticated } from "../middleware/auth.js";


const router = express();

router.route('/register-user').post(upload.fields([
    {name:'avatar',maxCount:1},
    {name:'resume',maxCount:1},
]),registerUser)
router.route("/login-user").post(loginUser)
router.route("/logout-user").get(authenticated,logoutUser)
router.route("/me").get(authenticated,getUser)
router.route("/update/info-user").post(upload.fields([
    {name:'avatar',maxCount:1},
    {name:'resume',maxCount:1},
]),authenticated,updateUserInfo)
router.route("/update/avatar-user").post(upload.fields([
    {name:'avatar',maxCount:1},
    {name:'resume',maxCount:1},
]),authenticated,updateUserAvatar)
router.route("/update/resume-user").post(upload.fields([
    {name:'avatar',maxCount:1},
    {name:'resume',maxCount:1},
]),authenticated,updateUserResume)




export default router