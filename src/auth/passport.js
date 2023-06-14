import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";

import { usersRepository } from "../repositories/index.js";
import { cartsRepository } from "../repositories/index.js";

import config from "../config/config.js";

import { createHash } from "../utils/utils.js";

const cookieExtractor = (req) => {
  let token = null;
  req && req.cookies ? (token = req.cookies["jwtCookie"]) : null;
  return token;
};

const { clientID, clientSecret, callbackUrl, JWT_SECRET, ADMIN_EMAIL } = config;
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

          const userExists = await usersRepository.getUser({ email: username });

          if (userExists) {
            console.log("User already exists");
            return done(null, false);
          }

          const cart = await cartsRepository.createCart();

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

          const result = await usersRepository.registerUser(newUser);

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
          const user = await usersRepository.getUser({
            email: profile._json.email,
          });
          if (!user) {
            const cart = await cartsRepository.createCart();
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

            const result = await usersRepository.registerUser(newUser);
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
