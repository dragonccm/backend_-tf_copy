require("dotenv").config();
import  jwt from 'jsonwebtoken';

const createToken = (payload) => {
  let key = process.env.JWT_SECRET_KEY;
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRES_IN });
  } catch (error) {
    console.log(error);
  }
  return token;
};
const verifyToken = (token) => {
  let key = process.env.JWT_SECRET_KEY;
  let decode = null;

  try {
    decode = jwt.verify(token, key);
  } catch (error) {
    console.log('error verifying token');
  }
  return decode;
};

const SecurePaths = ["/user", "/account", "/getInfor", "/editInfor", "/changepass",
  "/banSong", "/addlike", "/unlike", "/createplaylist", "/getuserplaylist", "/addtoplaylist",
  "/getuserlikesong", "/addnewhistory","/getHistory","/delemyplaylist"];

const extractToken = (req) => { 
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
  }
  return null
}
const checkUserJWT = (req, res, next) => {
  if (!SecurePaths.includes(req.path)) return next();

  let cookies = req.cookies;
  let tokenFromHeader = extractToken(req);
  if ((cookies && cookies.jwt) || tokenFromHeader) {
    let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
    // console.log(token)
    let decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EC: "-1",
        DT: "",
        EM: "Not authenticated the user",
      });
    }
  } else {
    return res.status(401).json({
      EC: "-1",
      DT: "",
      EM: "Not authenticated the user",
    });
  }
};
const checkUserPermission = (req, res, next) => {
  if (!SecurePaths.includes(req.path) || req.path === "/account")
    return next();

  if (req.user) {
    let email = req.user.email;
    let roles = req.user.groupWithRole.Roles;
    let currUrl = req.path;
    if (!roles || roles.length === 0) {

      return res.status(403).json({
        EC: "-1",
        DT: "",
        EM: `You don't have permission to access this resource...`,
      });
    }
    let canAccess = roles.some((item) => item.url === currUrl || currUrl.includes(item.url));
    if (canAccess) {
      next();
    } else {
      return res.status(403).json({
        EC: "-1",
        DT: "",
        EM: `You don't have permission to access this resource...`,
      });
    }
  } else {
    return res.status(401).json({
      EC: "-1",
      DT: "",
      EM: "Not authenticated the user",
    });
  }
};
module.exports = {
  createToken,
  verifyToken,
  checkUserJWT,
  checkUserPermission
};
