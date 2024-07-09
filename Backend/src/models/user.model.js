import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minLength: [6, "Password Must be 6 Cheracters!"],
    },
    profile: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    resume: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    phone: {
      type: Number,
      required: true,
    },
    aboutMe: {
      type: String,
      required: true,
    },
    portfolioURL: {
      type: String,
      required: true,
    },
    githubURL: {
      type: String,
      required: true,
    },
    facebookURL: {
      type: String,
      required: true,
    },
    instagramURL: {
      type: String,
      required: true,
    },
    linkidenURL: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.password.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(enterdPassword){
    return await bcrypt.compare(enterdPassword,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_TOKEN,{
        expiresIn:process.env.JWT_EXPIRES_TOKEN
    })
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_TOKEN,{
        expiresIn:process.env.JWT_EXPIRES_TOKEN
    })
}

export const User = mongoose.model("User", userSchema);
