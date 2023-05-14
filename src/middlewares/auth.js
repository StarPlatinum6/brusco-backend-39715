import jwt from "jsonwebtoken";
import config from "../config.js";

const isProtected = (req, res, next) => {
  const token = req.cookies.jwtCookie;

  if (!token) {
    return res.redirect("/");
  } else {
    jwt.verify(token, config.JWT_SECRET);
    next();
  }
};

const checkLogged = (req, res, next) => {
  const token = req.cookies.jwtCookie;

  if (token) {
    jwt.verify(token, config.JWT_SECRET);
    return res.redirect("/home");
  } else {
    next();
  }
};

export { checkLogged, isProtected };
