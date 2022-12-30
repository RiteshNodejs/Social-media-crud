function OTP(max){
    return Math.floor(Math.random()*max)
}
const otp =OTP(999999)
export default otp