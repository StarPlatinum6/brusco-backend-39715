import jwt from "jsonwebtoken";
import config from "../config.js";

const isProtected = (req, res, next) => {
  const token = req.cookies.jwtCookie;

  if (!token) {
    return res.redirect("/");
  } else {
    const decodedToken = jwt.verify(token, config.JWT_SECRET, {
      ignoreExpiration: true,
    });

    if (Date.now() / 1000 > decodedToken.exp) {
      res.clearCookie("jwtCookie");
      return res.redirect("/");
      // return res.status(401).send({ message: "Expired token." });
    }

    next();
  }
};

const checkLogged = (req, res, next) => {
  const token = req.cookies.jwtCookie;

  if (token) {
    const decodedToken = jwt.verify(token, config.JWT_SECRET, {
      ignoreExpiration: true,
    });

    if (Date.now() / 1000 > decodedToken.exp) {
      res.clearCookie("jwtCookie");
      return res.redirect("/home");
      // return res.status(401).send({ message: "Expired token." });
    }

    return res.redirect("/home");
  } else {
    next();
  }
};

export { checkLogged, isProtected };
