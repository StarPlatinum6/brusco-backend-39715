import Stripe from 'stripe'

import { config } from '../config/config.js'

const {
  stripe: { STRIPE_SECRET }
} = config

export default class PaymentService {
  constructor () {
    this.stripe = new Stripe(STRIPE_SECRET)
  }

  calculateOrderAmount = (products) => {
    let total = 0
    products.forEach((prod) => {
      const { productId, quantity } = prod
      const { price } = productId
      total += price * quantity
    })
    return total * 100
  }

  createPaymentIntent = async (products, email) => {
    const orderDetails = JSON.stringify(
      products.reduce((acc, item) => {
        acc[item.productId.title] = item.quantity
        return acc
      }, {}),
      null,
      '\t'
    )

    const paymentIntentInfo = {
      amount: this.calculateOrderAmount(products),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        user: email,
        orderDetails
      }
    }

    const paymentIntent = await this.stripe.paymentIntents.create(
      paymentIntentInfo
    )
    return paymentIntent
  }
}
