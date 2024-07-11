import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateToken } from "../utils/generateToken.js";

// ----- Register User ----- //
export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    email,
    password,
    phone,
    aboutMe,
    portfolioURL,
    githubURL,
    facebookURL,
    instagramURL,
    linkidenURL,
  } = req.body;

  if (
    [
      name,
      description,
      email,
      password,
      phone,
      aboutMe,
      portfolioURL,
      githubURL,
      facebookURL,
      instagramURL,
      linkidenURL,
    ].some((fileds) => fileds?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User Already Exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const resumeLocalPath = req.files?.resume[0]?.path;

  if (!avatarLocalPath || !resumeLocalPath) {
    throw new ApiError(401, "Avatar and Resume are required!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const resume = await uploadOnCloudinary(resumeLocalPath);

  if (!avatar || !resume) {
    throw new ApiError(400, "Avatar and Resume are required!");
  }

  const user = await User.create({
    name,
    description,
    email,
    password,
    phone,
    aboutMe,
    portfolioURL,
    githubURL,
    facebookURL,
    instagramURL,
    linkidenURL,
    avatar: {
        public_id: avatar.public_id,
        url: avatar.secure_url
      },
    resume: {
        public_id:resume.public_id,
        url:resume.secure_url
    },
  });

  const createUser = await User.findById(user._id).select("-password");
  if (!createUser) {
    throw new ApiError(500, "internal Server Error");
  }
   
  generateToken(createUser,"Created",200,res)
//   return res
//     .status(200)
//     .json(new ApiResponse(201, createUser, "User create Successfully"));
});

// ----- Generate Access And Refresh Token ----- //
const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(500, "Internal Server Error");
    }
  };
// ----- Login User ----- //
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json(400, "Email and Password are required!");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "This Email Not exist!");
  }

  const isPasswordCheck = await user.comparePassword(password);
  if (!isPasswordCheck) {
    throw new ApiError(400, "Wronge Password");
  }

//   const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id);

  const loggedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  );

//   const options = {
//     httpOnly: true,
//     secure: true,
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(new ApiResponse(200, loggedIn, "Login Successfully!"));

generateToken(loggedIn,"Login Successfully",200,res)
});

export const logoutUser = asyncHandler(async (req,res)=>{
    res.status(200).cookie("token",'',{
        expires:new Date(Date.now()),
        httpOnly:true,
    }).json(new ApiResponse(200,'',"Logout Successfully!"))
})