import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
  },
  email: { 
    type: String, 
    required: true,
  },
  password: { 
    type: String, 
    required: true,
  },
  created: {
    type: Date,
    require: true,
    default: Date.now,
  },
})

const UserModel = mongoose.model("user", userSchema)

export default UserModel