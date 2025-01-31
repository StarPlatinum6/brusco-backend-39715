import { Router } from 'express'
import { uploader } from '../utils.js'
import passport from 'passport'
import { verifyRole } from '../middlewares/auth.js'
import {
  currentUser,
  failRegister,
  githubCallback,
  githubLogin,
  loginUser,
  logoutUser,
  registerUser,
  restorePasswordProcess,
  updatePassword,
  changeRole,
  updateUserDocumentsAndStatus,
  updateProfilePicture,
  currentUserStatus,
  getUsers,
  deleteInactiveUsers,
  deleteUserByCartId
} from '../controllers/users.controller.js'

const usersRouter = Router()

usersRouter.post(
  '/register',
  passport.authenticate('register', {
    session: false,
    failureRedirect: '/api/v1/users/failRegister'
  }),
  registerUser
)

usersRouter.get('/failRegister', failRegister)
usersRouter.post('/login', loginUser)

usersRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  githubLogin
)

usersRouter.get(
  '/githubcallback',
  passport.authenticate('github', { session: false, failureRedirect: '/' }),
  githubCallback
)

usersRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => verifyRole(req, res, next, ['admin']),
  getUsers
)

usersRouter.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => verifyRole(req, res, next, ['user', 'premium', 'admin']),
  currentUser
)

usersRouter.get(
  '/:cid/status',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => verifyRole(req, res, next, ['user', 'premium', 'admin']),
  currentUserStatus
)

usersRouter.post(
  '/premium/:uid',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => verifyRole(req, res, next, ['user', 'premium', 'admin']),
  changeRole
)

usersRouter.post(
  '/:uid/documents',
  (req, res, next) => verifyRole(req, res, next, ['user', 'premium']),
  uploader.fields([
    { name: 'identification' },
    { name: 'address' },
    { name: 'statement' }
  ]),
  updateUserDocumentsAndStatus
)

usersRouter.post(
  '/:uid/profilepicture',
  (req, res, next) => verifyRole(req, res, next, ['user', 'premium', 'admin']),
  uploader.single('profile'),
  updateProfilePicture
)

usersRouter.post('/restore', restorePasswordProcess)
usersRouter.put('/resetPassword', updatePassword)

usersRouter.get('/logout', logoutUser)

usersRouter.delete(
  '/inactive',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => verifyRole(req, res, next, ['admin']),
  deleteInactiveUsers
)

usersRouter.delete(
  '/:cid',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => verifyRole(req, res, next, ['admin']),
  deleteUserByCartId
)

export default usersRouter
