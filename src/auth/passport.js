import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";

import { cartService, userService } from "../services/index.js";

import { config } from "../config/config.js";

import { createHash } from "../utils.js";

const cookieExtractor = (req) => {
  let token = null;
  req && req.cookies ? (token = req.cookies[COOKIE_NAME]) : null;
  return token;
};

const {
  admin: { ADMIN_EMAIL },
  github: { clientID, clientSecret, callbackUrl },
  jwt: { COOKIE_NAME, JWT_SECRET },
} = config;

const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const jwtOptions = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
};

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          let { role } = req.body;

          const userExists = await userService.checkExistingUser(username);

          if (userExists) {
            console.log("User already exists");
            return done(null, false);
          }

          const cart = await cartService.createCart();

          const newUser = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
            role:
              username === `${ADMIN_EMAIL}`
                ? (role = "admin")
                : (role = "user"),
            cart: cart._id,
          };

          const result = await userService.registerUser(newUser);

          return done(null, result);
        } catch (error) {
          return done(null, false);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userService.getUser(profile._json.email);
          if (!user) {
            const cart = await cartService.createCart();
            let role;

            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email: profile._json.email,
              password: "",
              role:
                profile._json.email === `${ADMIN_EMAIL}`
                  ? (role = "admin")
                  : (role = "user"),
              cart: cart._id,
            };

            const result = await userService.registerUser(newUser);
            return done(null, result);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
