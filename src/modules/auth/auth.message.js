const AuthMessage = Object.freeze({
    sendOTPSuccessfully: "send otp successfully",
    notFound: "user not found",
    otpCodeNotExpired: "otp code not expired",
    otpCodeExpired: "otp code expired",
    otpCodeIsIncorrect: "otp code is incorrect",
    loginSuccessfully: "login successfully"
})

module.exports = {
    AuthMessage
}