const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

//Schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Email is not valid");
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value))
          throw new Error("Password is not Strong");
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value))
          throw new Error("Gender is not valid");
      },
    },
    photoUrl: {
      type: String,
      default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
      validate(value){
        if(!validator.isURL(value)) throw new Error("Please provide valid image URL")
      }
    },
    about: {
      type: String,
      default: "This is default about of the user!!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

//Model
const User = mongoose.model("User", userSchema);

module.exports = User;
