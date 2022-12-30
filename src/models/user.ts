import mongoose from "mongoose";
import { Schema } from "mongoose";
import { nanoid } from "nanoid";
import bcrypt from 'bcrypt'
const userSchema = new Schema({
    _id:{
        type:String,
        default:()=>nanoid(),
    },
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:false
    },
    address: {
        location:{
          type:String,
          required:false
        },
        
        city: {
          type: String,
          required: false,
        },
        state: {
          type: String,
          required: false,
        },
        zipCode: {
          type: String,
          required: false,
        },
        landMark:{
            type:String,
            required:false
        },
        latitute:{
          type:String,
          required:false
      },
      longitude:{
        type:String,
        required:false
    },
    },
    otp:{
      type:Number,
      required:false
    },
    emailVerified:{
      type:Number,
      enum:[0,1],
      default:0
    },
    status:{
      type:String,
      enum:['public','private'],
      default:'private'
    }
})
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(12)
    const passwordhash = await bcrypt.hash(this.password, salt);
    this.password = passwordhash
    next();
  }
  catch(error) {
   return next(error)

  }
})
let userDb =mongoose.model('user',userSchema)
export default userDb