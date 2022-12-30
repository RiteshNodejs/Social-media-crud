import userDb from "../models/user";
import otp from "../utils/helpers/otp";
import bcrypt from 'bcrypt';
import  jwt  from "jsonwebtoken";
import AuthMiddleware from '../utils/middleware/auth_middleware'
// import NodeMailer from '../utils/helpers/mailer'
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
class UserServices {
  async userRegister(parent, args) {
    const extUser = await userDb.findOne({ email: args.register.email });
    //check if email is already in use then throw error
    if (extUser) {
      throw new Error("User already exist");
    }
    // input from args
    const argsData = {
      firstName: args.register.firstName,
      lastName: args.register.lastName,
      email: args.register.email,
      password: args.register.password,
      address: args.register.address,
      otp: otp,
      status: args.register.status[0],
    };

    // node mailer 
    const transporter = await nodemailer.createTransport(
      smtpTransport({
        service: "Gmail",

        auth: {
          user: "riteshpathaniawins@gmail.com",
          pass: "xwolwlzzukqrzwqa",
        },
      })
    );
    const mailOption = {
      to: args.register.email,
      from: "riteshpathaniawins@gmail.com",
      subject: "node mailer OTP",
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome </h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${argsData.otp}</h1>
   </div>`,
    };
    await transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        throw new Error("message: MESSAGES.NOT_SENT");
      }
    });
    // save 
    const newUser = new userDb(argsData);
    let saveUser = await newUser.save();
    return {
      firstName: saveUser.firstName,
      lastName: saveUser.lastName,
      email: saveUser.email,
      address: {
        location: saveUser.address.location,
        city: saveUser.address.city,
        state: saveUser.address.state,
        zipCode: saveUser.address.zipCode,
        landMark: saveUser.address.landMark,
        latitute: saveUser.address.latitute,
        longitude: saveUser.address.longitude,
      },
      status:saveUser.status
    };
  } 
 async verifyEmail(parent,args){
    const extUser = await userDb.findOne({ email: args.OTP.email });
    if (!extUser) {
      throw new Error("Email dont exist");
    }
    //check  email is verified then throw error
    if (extUser.emailVerified==1) {
      throw new Error("Email already verified");
    }
    const userOTP = args.OTP.otp
    // compaire otp for input and existing otp in db 
    if(extUser.otp !== userOTP){
      throw new Error('invalid Otp')
    }
    const updateVerifyCheck = await userDb.findOneAndUpdate({email: args.OTP.email},{emailVerified:1})
    return {
      emailVerified:"email verifeid sucessfully" 
    }
  
  }
  async logIn(parent, args) {
    const extUser = await userDb.findOne({ email: args.login.email });
    //check if email exixt or not
    if (!extUser) {
      throw new Error("Invalid Credentials ");
    }
    // check email is verified or not
    if (extUser.emailVerified==0) {
      throw new Error("Email is not verified");
    }
    // compare user input password with existing password
    const validPassword = await bcrypt.compare(
      args.login.password,
      extUser.password
    );
    // in case of invalid password throw error
    if (!validPassword) {
      throw new Error("Invalid Credentials ");
    }
    // genrate jwt token
    const token = await jwt.sign(
      { _id: extUser._id },
      "mykey",
      {
        expiresIn: "1d",
      }
    );
    return {
      email: extUser.email,
      Token: token,
    };
  }
  async resendVerifyEmail(parent,args){
    const extUser = await userDb.findOne({ email: args.resendOTP.email });
    //check if email exixt or not
    if (!extUser) {
      throw new Error("Invalid Credentials ");
    }
    // check email is verified or not
    if (extUser.emailVerified==1) {
      throw new Error("Ooops Email is verified");
    }
    // compare user input password with existing password
    const validPassword = await bcrypt.compare(
      args.resendOTP.password,
      extUser.password
    );
    // in case of invalid password throw error
    if (!validPassword) {
      throw new Error("Invalid Credentials ");
    }
    const newOTP =otp
    // node mailer
    const transporter = await nodemailer.createTransport(
      smtpTransport({
        service: "Gmail",

        auth: {
          user: "riteshpathaniawins@gmail.com",
          pass: "xwolwlzzukqrzwqa",
        },
      })
    );
    const mailOption = {
      to: args.resendOTP.email,
      from: "riteshpathaniawins@gmail.com",
      subject: "node mailer OTP",
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome </h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${newOTP}</h1>
   </div>`,
    };
    await transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        throw new Error("message: MESSAGES.NOT_SENT");
      }
    });
  
  const updateOTP = await userDb.findOneAndUpdate({email: args.resendOTP.email},{otp:newOTP})
    return {
      emailVerified:"email send sucessfully" 
    }
  }
  async forgetPassword(parent,args){
    const extUser = await userDb.findOne({ email: args.forgetPassword.email });
    //check if email exixt or not
    if (!extUser) {
      throw new Error("Invalid Credentials ");
    }
   const newOTP = otp
        // node mailer
        const transporter = await nodemailer.createTransport(
          smtpTransport({
            service: "Gmail",
    
            auth: {
              user: "riteshpathaniawins@gmail.com",
              pass: "xwolwlzzukqrzwqa",
            },
          })
        );
        const mailOption = {
          to: args.forgetPassword.email,
          from: "riteshpathaniawins@gmail.com",
          subject: "node mailer OTP",
          html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>Welcome </h2>
            <h4>You are officially In ✔</h4>
            <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${newOTP}</h1>
       </div>`,
        };
        await transporter.sendMail(mailOption, function (error, info) {
          if (error) {
            throw new Error("message: MESSAGES.NOT_SENT");
          }
        });
      
      const updateOTP = await userDb.findOneAndUpdate({email: args.forgetPassword.email},{otp:newOTP})
      return {
        otpStatus:"otp send sucessfully" 
      }
  }
  async resetPassword(parent,args){
    const extUser = await userDb.findOne({ email: args.resetPassword.email });
    //check if email exixt or not
    if (!extUser) {
      throw new Error("Invalid Credentials ");
    }
    //OTP form user input 
    const userOTP = args.resetPassword.otp
    // compaire otp for input and existing otp in db 
    if(extUser.otp !== userOTP){
      throw new Error('invalid Otp')
    }
    const resetPassword = await userDb.findOneAndUpdate({email: args.resetPassword.email},{password:args.resetPassword.newPassword})
    return {
      restPassword:"password reset sucessfully" 
    }
  }
 async getProfile(parent,args,context){
    AuthMiddleware.Validattion(parent,args,context)
    const idUser = context.user._id;
    const register = await userDb.findOne({ _id:idUser });
    return register
  }
}
export default new UserServices();
