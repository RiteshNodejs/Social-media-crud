const typeDefs = `#graphql
type taddress{
    location:String!,
    city:String!,
    state:String!,
    zipCode:String!,
    landMark:String!,
    latitute:String!,
    longitude:String!,
    
}
enum status {
    public,
    private
}
type register{
    firstName:String!,
    lastName:String!,
    email:String!,
    password:String!,
    address:taddress,
    status:String
}
type OTP{
    otp:Int,
    email:String,
    emailVerified:String
},
type login {
    email:String,
    password:String,
    Token:String,
   },
type resendOTP{
    emailVerified:String
}
type forgetPassword{
    otpStatus:String
}
type resetPassword{
    restPassword:String
}
type Query {
    hello: String,
    resendVerifyEmail(resendOTP:iresendOTP):resendOTP,
    forgetPassword(forgetPassword:iforgetPassword):forgetPassword,
    getProfile:register

    
}
input iresetPassword{
    email:String!,
    otp:Int,
    newPassword:String
}
input iforgetPassword{
    email:String!
}
input iresendOTP{
    email:String!,
    password:String!
}
input iOTP{
    email:String!,
    otp:Int!
}
input iaddress{
    location:String,
    city:String,
    state:String,
    zipCode:String,
    landMark:String,
    latitute:String,
    longitude:String,
    
}
input iregister{
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    address:iaddress,
    status:[status]
},
input logInput {
    email:String!,
    password:String!,
  },
type Mutation{
   
    userRegistor(register:iregister):register,
    verifyEmailOtp(OTP:iOTP):OTP,
    logInUser(login:logInput):login,
    resetPassword(resetPassword:iresetPassword):resetPassword
    
  }  
`;

export default typeDefs;
