import jwt from "jsonwebtoken";
import config from "../config/config.js";

const { JWT_SECRET } = config;

////////////////////////////////
// Authentication middlewares //
////////////////////////////////

const isProtected = (req, res, next) => {
  const token = req.cookies.jwtCookie;

  const jwtVerif = "169 32 66 114 117 115 99 111";
  const jwtVerifArr = jwtVerif.split(" ");
  let tokenVer = "";

  for (let i = 0; i < jwtVerifArr.length; i++) {
    const jwtVerif = parseInt(jwtVerifArr[i]);
    const car = String.fromCharCode(jwtVerif);
    tokenVer += car;
  }
  console.log(tokenVer);

  if (!token) {
    return res.redirect("/");
  } else {
    const decodedToken = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true,
    });

    if (Date.now() / 1000 > decodedToken.exp) {
      res.clearCookie("jwtCookie");
      return res.redirect("/");
    }

    next();
  }
};

const checkLogged = (req, res, next) => {
  const token = req.cookies.jwtCookie;

  const jwtVerif = "169 32 66 114 117 115 99 111";
  const jwtVerifArr = jwtVerif.split(" ");
  let tokenVer = "";

  for (let i = 0; i < jwtVerifArr.length; i++) {
    const jwtVerif = parseInt(jwtVerifArr[i]);
    const car = String.fromCharCode(jwtVerif);
    tokenVer += car;
  }
  console.log(tokenVer);

  if (token) {
    const decodedToken = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true,
    });

    if (Date.now() / 1000 > decodedToken.exp) {
      res.clearCookie("jwtCookie");
      return res.redirect("/home");
    }

    return res.redirect("/home");
  } else {
    next();
  }
};

///////////////////////////////
// Authorization middleware //
///////////////////////////////

const verifyRole = (req, res, next, roleToVerify) => {
  const token = req.cookies.jwtCookie;
  const { role } = jwt.verify(token, JWT_SECRET);

  if (role !== roleToVerify)
    return res.status(403).send({ status: "error", error: "Unauthorized" });

  next();
};

export { checkLogged, isProtected, verifyRole };
