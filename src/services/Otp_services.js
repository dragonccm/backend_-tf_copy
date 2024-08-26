import Otp from "../models/OTP_model.js";
import User from "../models/user_model.js";
import { hashPassword, checkPassword } from "./Authentication_service.js";
const otpGenerator = require("otp-generator");

const CreateOtp = async (valueLogin) => {
  try {
    const user = await User.findOne({
      $or: [
        { email: valueLogin },
        { username: valueLogin },
        { id: valueLogin },
      ],
    });
    const OTP = await Otp.find({
      email: user.email,
    });
    if (user) {
      if (OTP.length <3) {
        const otp = otpGenerator.generate(5, {
          lowerCaseAlphabets: false, // Không sử dụng chữ thường
          upperCaseAlphabets: true, // Sử dụng chữ in hoa
          specialChars: false,
        });
        console.log(otp);
        const hashOtp = hashPassword(otp);
        const newOtp = new Otp({
          email: user.email,
          otp: hashOtp, // Giả sử đây là OTP bạn đã tạo
        });

        newOtp.save();

        const data = {
          receiver: [{ name: "HT90", email: `${user.email}` }],
          subject: `${otp} là mã OTP của bạn`,
          description: { otp: `${otp}` },
          template: "otpMS",
          mail_type: "text/html",
        };
        const response = await fetch(
          "https://mailwtfdev.binhminh19112003.workers.dev/api/mail/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.status === 200) {
          return {
            EM: "ok!",
            EC: "0",
            DT: user.id,
          };
        } else {
          return {
            EM: "Server error",
            EC: "2",
            DT: "",
          };
        }
      } else {
        return {
          EM: "Không thể gửi thêm OTP !!",
          EC: "3",
          DT: "",
        };
      }
    } else {
      return {
        EM: "Không tồn tại tài khoản này!!",
        EC: "2",
        DT: "",
      };
    }
  } catch (error) {
    console.log("error: >>>>", error);
    return {
      EM: "error creating user",
      EC: "2",
      DT: "",
    };
  }
};
const VerifyOtp = async (id, verifyOtp) => {
  try {
    const user = await User.findOne({
      id: id,
    });
    const OTP = await Otp.find({
      email: user.email,
    });
    console.log(OTP);
    console.log(user);
    if (!OTP.length) {
      return {
        EM: "Không tồn tại OTP",
        EC: "2",
        DT: "",
      };
    }
    const lastOTP = OTP[OTP.length - 1];
    if (user && OTP && lastOTP) {
      let checkOtp = await checkPassword(verifyOtp, lastOTP.otp);
      if (checkOtp) {
        await Otp.deleteMany({ email: user.email });
        return {
          EM: "ok!",
          EC: "0",
          DT: {},
        };
      } else {
        return {
          EM: "OTP không đúng!!",
          EC: "3",
          DT: {},
        };
      }
    } else {
      return {
        EM: "User hoặc OTP không tồn tại!!",
        EC: "2",
        DT: "",
      };
    }
  } catch (error) {
    console.log("error: >>>>", error);
    return {
      EM: "error server",
      EC: "2",
      DT: "",
    };
  }
};
module.exports = {
  CreateOtp,
  VerifyOtp,
};
