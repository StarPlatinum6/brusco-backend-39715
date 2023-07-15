import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

import CustomError from '../services/errors/CustomError.js'
import {
  ErrorCodes,
  ErrorMessages,
  ErrorNames
} from '../services/errors/enums.js'
import {
  authenticationErrorInfo,
  authorizationErrorInfo
} from '../services/errors/info.js'

const {
  jwt: { COOKIE_NAME, JWT_SECRET }
} = config

/// /////////////////////////////
// Authentication middlewares //
/// /////////////////////////////

export const isProtected = (req, res, next) => {
  const token = req.cookies.jwtCookie

  const jwtVerif = '169 32 66 114 117 115 99 111'
  const jwtVerifArr = jwtVerif.split(' ')
  let tokenVer = ''

  for (let i = 0; i < jwtVerifArr.length; i++) {
    const jwtVerif = parseInt(jwtVerifArr[i])
    const car = String.fromCharCode(jwtVerif)
    tokenVer += car
  }
  console.log(tokenVer)

  if (!token) {
    return res.redirect('/')
  } else {
    const decodedToken = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true
    })

    if (Date.now() / 1000 > decodedToken.exp) {
      res.clearCookie(COOKIE_NAME)
      return res.redirect('/')
    }

    next()
  }
}

export const checkLogged = (req, res, next) => {
  const token = req.cookies.jwtCookie

  const jwtVerif = '169 32 66 114 117 115 99 111'
  const jwtVerifArr = jwtVerif.split(' ')
  let tokenVer = ''

  for (let i = 0; i < jwtVerifArr.length; i++) {
    const jwtVerif = parseInt(jwtVerifArr[i])
    const car = String.fromCharCode(jwtVerif)
    tokenVer += car
  }
  console.log(tokenVer)

  if (token) {
    const decodedToken = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true
    })

    if (Date.now() / 1000 > decodedToken.exp) {
      res.clearCookie(COOKIE_NAME)
      return res.redirect('/home')
    }

    return res.redirect('/home')
  } else {
    next()
  }
}

/// ////////////////////////////
/// /// Auth middlewares ///////
/// ////////////////////////////

export const verifyRole = (req, res, next, rolesToVerify) => {
  const token = req.cookies.jwtCookie

  if (!token) {
    const error = CustomError.createError({
      name: ErrorNames.NO_AUTHENTICATION_ERROR,
      cause: authenticationErrorInfo(),
      message: ErrorMessages.NO_AUTHENTICATION_ERROR_MESSAGE,
      code: ErrorCodes.AUTHENTICATION_ERROR,
      status: 401
    })
    return next(error)
  }

  const { role } = jwt.verify(token, JWT_SECRET)

  if (!rolesToVerify.includes(role)) {
    const error = CustomError.createError({
      name: ErrorNames.NO_AUTHORIZATION_ERROR,
      cause: authorizationErrorInfo({ role, rolesToVerify }),
      message: ErrorMessages.NO_AUTHORIZATION_ERROR_MESSAGE,
      code: ErrorCodes.AUTHORIZATION_ERROR,
      status: 403
    })
    return next(error)
  }

  next()
}

/// ////////////////////////////
/// /// JWT middlewares ////////
/// ////////////////////////////

export const verifyPassRestoreJwt = (req, res, next) => {
  const { token } = req.query
  if (!token) {
    return res.status(401).send({ message: 'No JWT provided' })
  }
  const decodedToken = jwt.verify(token, JWT_SECRET, {
    ignoreExpiration: true
  })

  if (Date.now() / 1000 > decodedToken.exp) {
    return res.redirect('/restore')
  }
  next()
}
