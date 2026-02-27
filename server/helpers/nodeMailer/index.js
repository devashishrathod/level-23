const { sendLoginOtpMail } = require("./sendLoginOtpMail");
const {
  sendOtpVerificationSuccessMail,
} = require("./sendOtpVerificationSuccessMail");
const { sendCreativeMail } = require("./sendCreativeMail");

module.exports = {
  sendLoginOtpMail,
  sendOtpVerificationSuccessMail,
  sendCreativeMail,
};
