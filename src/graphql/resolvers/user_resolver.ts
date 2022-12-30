import UserServices from '../../services/user_services'
 const userResolvers = {
    Query: {
      hello: () => 'world',
      resendVerifyEmail:UserServices.resendVerifyEmail,
      forgetPassword:UserServices.forgetPassword,
      getProfile:UserServices.getProfile
    },
    Mutation:{
        userRegistor:UserServices.userRegister,
        verifyEmailOtp:UserServices.verifyEmail,
        logInUser:UserServices.logIn,
        resetPassword:UserServices.resetPassword
       
        
    }
  };
  export default  userResolvers


