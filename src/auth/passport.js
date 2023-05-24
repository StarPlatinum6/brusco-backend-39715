import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";

import UserManager from "../dao/dbManagers/userManager.js";
import CartManager from "../dao/dbManagers/cartManager.js";

import config from "../config.js";

import { createHash } from "../utils.js";

const cookieExtractor = (req) => {
  let token = null;
  req && req.cookies ? (token = req.cookies["jwtCookie"]) : null;
  return token;
};

const { clientID, clientSecret, callbackUrl, JWT_SECRET } = config;
const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const jwtOptions = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
};

const cartManager = new CartManager();
const userManager = new UserManager();

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

          const userExists = await userManager.getUser({ email: username });

          if (userExists) {
            console.log("User already exists");
            return done(null, false);
          }

          const cart = await cartManager.createCart();

          const newUser = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
            role:
              username === `${config.ADMIN_EMAIL}`
                ? (role = "admin")
                : (role = "user"),
            cart: cart._id,
          };

          const result = await userManager.registerUser(newUser);

          return done(null, result);
        } catch (error) {
          return done(`Error trying to create user: ${error}`);
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
          const user = await userManager.getUser({
            email: profile._json.email,
          });
          if (!user) {
            const cart = await cartManager.createCart();
            let role;

            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email: profile._json.email,
              password: "",
              role:
                profile._json.email === `${config.ADMIN_EMAIL}`
                  ? (role = "admin")
                  : (role = "user"),
              cart: cart._id,
            };

            const result = await userManager.registerUser(newUser);
            return done(null, result);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userManager.getUserById(id);
    done(null, user);
  });
};

export default initializePassport;
