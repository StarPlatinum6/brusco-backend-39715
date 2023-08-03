import { Router } from 'express'
import { verifyRole } from '../middlewares/auth.js'
import { createPaymentIntent } from '../controllers/payments.controller.js'

const paymentsRouter = Router()
paymentsRouter.get(
  '/create-payment-intent',
  (req, res, next) => verifyRole(req, res, next, ['user', 'premium']),
  createPaymentIntent
)

export default paymentsRouter
