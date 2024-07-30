import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateToken } from "../utils/generateToken.js";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import { sendEmail } from "../utils/sendEmail.js";

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
      url: avatar.secure_url,
    },
    resume: {
      public_id: resume.public_id,
      url: resume.secure_url,
    },
  });

  const createUser = await User.findById(user._id).select("-password");
  if (!createUser) {
    throw new ApiError(500, "internal Server Error");
  }

  generateToken(createUser, "Created", 200, res);
  //   return res
  //     .status(200)
  //     .json(new ApiResponse(201, createUser, "User create Successfully"));
});

// ----- Generate Access And Refresh Token ----- //
// const generateAccessAndRefreshToken = async (userId) => {
//     try {
//       const user = await User.findById(userId);
//       const accessToken = user.generateAccessToken();
//       const refreshToken = user.generateRefreshToken();
//       user.refreshToken = refreshToken;
//       await user.save({ validateBeforeSave: false });
//       return { accessToken, refreshToken };
//     } catch (error) {
//       throw new ApiError(500, "Internal Server Error");
//     }
//   };
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

  generateToken(loggedIn, "Login Successfully", 200, res);
});

// ----- Logout User ----- //
export const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json(new ApiResponse(200, "", "Logout Successfully!"));
});

// ----- Get User ----- //
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json(new ApiResponse(200, user, "User Get Successfully!"));
});

// ----- Update Profile ----- //
export const updateUserInfo = asyncHandler(async (req, res) => {
  const updateUser = {
    name: req.body.name,
    description: req.body.description,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    portfolioURL: req.body.portfolioURL,
    githubURL: req.body.githubURL,
    facebookURL: req.body.facebookURL,
    instagramURL: req.body.instagramURL,
    linkidenURL: req.body.linkidenURL,
  };
  if (req.files && req.files?.avatar[0].path) {
    const avatar = req.files?.avatar[0].path;
    const user = await User.findById(req.user._id);
    const profileImageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(profileImageId);
    const newProfileImage = await uploadOnCloudinary(avatar);
    updateUser.avatar = {
      public_id: newProfileImage.public_id,
      url: newProfileImage.secure_url,
    };
  }
  if (req.files && req.files?.resume[0].path) {
    const resume = req.files?.resume[0].path;
    const user = await User.findById(req.user._id);
    const resumeId = user.resume.public_id;
    await cloudinary.uploader.destroy(resumeId);
    const newResume = await uploadOnCloudinary(resume);
    updateUser.resume = {
      public_id: newResume.public_id,
      url: newResume.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user._id, updateUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res
    .status(201)
    .json(new ApiResponse(200, user, "User Profile Updated Successfully!"));
});

// ----- Update Avatar ----- //
export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(avatarLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "missing avatar");
  }
  const user = await User.findById(req.user._id);
  const avatarId = user.avatar.public_id;
  await cloudinary.uploader.destroy(avatarId);
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    {
      new: true,
    }
  ).select("-password");

  res.status(200).json(new ApiResponse(200, avatar.url, "Avatar Updated!"));
});

// ----- Update Avatar ----- //
export const updateUserResume = asyncHandler(async (req, res) => {
  const resumeLocalPath = req.files?.resume[0]?.path;
  console.log(resumeLocalPath);
  if (!resumeLocalPath) {
    throw new ApiError(400, "Missing Resume");
  }
  const user = await User.findById(req.user._id);
  const resumeId = user.resume.public_id;
  await cloudinary.uploader.destroy(resumeId);
  const resume = await uploadOnCloudinary(resumeLocalPath);
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { resume: resume.url } },
    {
      new: true,
    }
  ).select("-password");

  res.status(200).json(new ApiResponse(200, resume.url, "Avatar Updated!"));
});

// ----- Update Password ----- //
export const updateUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All Fields Are Required!");
  }
  const user = await User.findById(req.user._id);
  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    throw new ApiError(400, "Incorrect Current Password");
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New Password And Confirm Password Not Match.");
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json(new ApiResponse(200, "Password Updated!"));
});

// ----- Get Protfolio Owner ----- //
export const getUserPortfolio = asyncHandler(async (req, res) => {
  const id = "669037b4701e886f4c69c210";
  const user = await User.findById(id).select("-password");
  res.status(200).json(new ApiResponse(200, user, true));
});

// ----- Forget Password ----- //
export const forgetUserPassword = asyncHandler(async (req, res,next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new ApiError("User Not Found", 404);
  }
  const resetToken = await user.getResetToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.DASHBORAD_URL}/password/reset/${resetToken}`;
  const message = `Your Reset Password Token Is:- \n\n ${resetPasswordUrl}\n\n if you've not request for this please ignore it.`;

  try {
    await sendEmail({
      email:user.email,
      subject : 'Personal Protfolio Dashboard Recovery Password',
      message
    })
    res.status(200).json(new ApiResponse(200,`email sent to ${user.email} Successfully!`))
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    console.log(`Forget Password Error ${error}`);
    return next(new ApiError(error.message,500))
  }
});
