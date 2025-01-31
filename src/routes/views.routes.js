import { Router } from 'express'
import passport from 'passport'

import {
  checkLogged,
  isProtected,
  verifyRole,
  verifyPassRestoreJwt
} from '../middlewares/auth.js'

import {
  cartView,
  chatView,
  homeView,
  loginView,
  productView,
  profileView,
  realTimeProductsView,
  registerView,
  restorePasswordView,
  resetPasswordView,
  ticketsView,
  adminView
} from '../controllers/views.controller.js'

const viewsRouter = Router()

viewsRouter.get('/', checkLogged, loginView)

viewsRouter.get('/register', checkLogged, registerView)

viewsRouter.get(
  '/profile',
  isProtected,
  passport.authenticate('jwt', { session: false }),
  profileView
)

viewsRouter.get('/restore', restorePasswordView)

viewsRouter.get('/resetPassword', verifyPassRestoreJwt, resetPasswordView)

viewsRouter.get(
  '/home',
  isProtected,
  passport.authenticate('jwt', { session: false }),
  homeView
)

viewsRouter.get(
  '/product/:pid',
  isProtected,
  passport.authenticate('jwt', { session: false }),
  productView
)

viewsRouter.get(
  '/cart/:cid',
  isProtected,
  (req, res, next) => verifyRole(req, res, next, ['user', 'premium']),
  passport.authenticate('jwt', { session: false }),
  cartView
)

viewsRouter.get(
  '/tickets',
  isProtected,
  (req, res, next) => verifyRole(req, res, next, ['user', 'premium']),
  passport.authenticate('jwt', { session: false }),
  ticketsView
)

viewsRouter.get(
  '/admin',
  isProtected,
  (req, res, next) => verifyRole(req, res, next, ['admin']),
  passport.authenticate('jwt', { session: false }),
  adminView
)

/// ///////////////////////////////////////////////////

viewsRouter.get(
  '/realtimeproducts',
  isProtected,
  passport.authenticate('jwt', { session: false }),
  realTimeProductsView
)

viewsRouter.get(
  '/chat',
  isProtected,
  (req, res, next) => verifyRole(req, res, next, ['user', 'premium']),
  passport.authenticate('jwt', { session: false }),
  chatView
)

export default viewsRouter
