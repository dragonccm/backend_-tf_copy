const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();
import User from "./src/models/user_model";
import {
  hashPassword,
  generateId,
} from "./src/services/Authentication_service";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      //   thêm vào db
      const user = await User.findOne({
        email: profile.emails[0].value,
      });
      if (!user) {
        let hashPass = hashPassword("123456xyz");
        const user = new User({
          id: generateId(),
          email: profile.emails[0].value,
          username: profile.id,
          password: hashPass,
          avt: profile.photos[0].value,
          birthday: "",
          role: "1",
          type_login: "email",
          token:generateId()
        });
        await user.save();
      return cb(null, profile, user);

      } else {
        const user = await User.findOneAndUpdate({ email: profile.emails[0].value }, {token:generateId()}, {
          upsert: true,
          new: true,
        }).select("-_id email token")
      return cb(null, profile, user);

      }

    }
  )
);
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ['email','photos','id', 'displayName']
},
async function(accessToken, refreshToken, profile, cb) {
  console.log(profile)
  const user = await User.findOne({
    email: profile.emails[0].value,
  });
  if (!user) {
    let hashPass = hashPassword("123456xyz");
    const user = new User({
      id: generateId(),
      email: profile.emails[0].value,
      username: profile.id,
      password: hashPass,
      avt: profile.photos[0].value,
      birthday: "",
      role: "1",
      type_login: "facebook",
      token:generateId()
    });
    await user.save();
  return cb(null, profile, user);

  } else {
    const user = await User.findOneAndUpdate({ email: profile.emails[0].value }, {token:generateId(),avt:profile.photos[0].value}, {
      upsert: true,
      new: true,
    }).select("-_id email token")
  return cb(null, profile, user);

  }

}
));
