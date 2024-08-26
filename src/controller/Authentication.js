import Authentication_service from "../services/Authentication_service.js";
import Otp_service from "../services/Otp_services.js";
const handleRegister = async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(200).json({
        EM: "missing required",
        EC: "1",
        DT: "",
      });
    }
    let data = await Authentication_service.handleRegister(req.body);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    if (!req.body.valueLogin || !req.body.password) {
      return res.status(200).json({
        EM: "missing required",
        EC: "1",
        DT: "",
      });
    }
    let data = await Authentication_service.handleLogin(req.body);
    if (data) {
      if (req.body.checkRemember) {
        console.log('lâu')
        res.cookie("jwt", data.DT.access_token, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      } else {
        res.cookie("jwt", data.DT.access_token, {
          httpOnly: true,
          maxAge: 24*60 * 60 * 1000,
        });
      }
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (error) {
    console.log("error: >>>>", error);

    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const handleLogingg = async (req, res) => {
  try {
    let check = await Authentication_service.handleAuthGG(req.body.id);
    if (check) {
      
        res.cookie("jwt", check.DT.access_token, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      
      return res.status(200).json({
        EM: check.EM,
        EC: check.EC,
        DT: check.DT,
      });
    }
  } catch (error) {
    console.log("error: >>>>", error);

    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const handleLogout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      EM: "clear cookies",
      EC: "0",
      DT: "",
    });
  } catch (error) {
    console.log("error: >>>>", error);

    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const checkAccount = async (req, res) => {
  const account = await Authentication_service.handleCheckAccount(req.user.id)
  if (req.user.id && account) {
    return res.status(200).json({
      EM: "ok!",
      EC: "0",
      DT: {
        access_token: req.token,
        // groupWithRole:req.user.groupWithRole,
        email: req.user.email,
        username: req.user.username,
        avt: account.DT.avt|| '',
        myPlayLists: account.DT.myPlayLists,
        likedSongs: account.DT.likedSongs,
        likedPlayLists: account.DT.likedPlayLists,
        isAdmin: account.DT.role == "0" ? true: false,
        isBan: account.DT.role == "2" ? true : false,
        id: account.DT.id,
      },
    });
  } else {
    return res.status(200).json({
      EM: "not login",
      EC: "1",
      DT: []
    });
  }
  
};
const handleForgotPassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(500).json({
        EM: "Email rỗng!",
        EC: "-1",
        DT: "",
      });
    }
    let check = await Otp_service.CreateOtp(req.body.email);
    if (check) {
      res.cookie("userIdentifier", `${check.DT}`, {
        maxAge: 900000,
        httpOnly: true,
      });
      return res.status(200).json({
        EM: check.EM,
        EC: check.EC,
        DT: {},
      });
    }
  } catch (error) {
    console.log("error: >>>>", error);

    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const RequestOTP = async (req, res) => {
  try {
    const id = req.cookies.userIdentifier;
    let check = await Otp_service.CreateOtp(id);
    if (check) {
      res.cookie("userIdentifier", `${check.DT}`, {
        maxAge: 900000,
        httpOnly: true,
      });
      return res.status(200).json({
        EM: check.EM,
        EC: check.EC,
        DT: {},
      });
    }
  } catch (error) {
    console.log("error: >>>>", error);

    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const handleVerifyOtp = async (req, res) => {
  try {
    if (!req.body.otp) {
      return res.status(500).json({
        EM: "OTP rỗng!",
        EC: "-1",
        DT: "",
      });
    }
    const id = req.cookies.userIdentifier;
    let check = await Otp_service.VerifyOtp(id,req.body.otp);
    if (check) {
      return res.status(200).json({
        EM: check.EM,
        EC: check.EC,
        DT: check.DT,
      });
    }
  } catch (error) {
    console.log("error: >>>>", error);

    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
module.exports = {
  handleRegister,
  handleLogin,
  handleLogingg,
  handleLogout,
  checkAccount,
  handleForgotPassword,handleVerifyOtp,RequestOTP
};
