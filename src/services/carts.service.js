import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import { cartsRepository, productsRepository } from '../repositories/index.js'

const {
  jwt: { JWT_SECRET }
} = config

export default class CartService {
  constructor () {}

  async getCartById (cid) {
    try {
      const filteredCart = await cartsRepository.getCartById(cid)
      if (!filteredCart) throw new Error(`Cart with id: ${cid} does not exist`)

      return filteredCart
    } catch (error) {
      throw error
    }
  }

  async createCart () {
    try {
      const newCart = await cartsRepository.createCart()
      if (!newCart) throw new Error('Error creating new cart')

      return newCart
    } catch (error) {
      throw error
    }
  }

  async addToCart (cid, pid, quantity, token) {
    try {
      const { email } = jwt.verify(token, JWT_SECRET, {
        ignoreExpiration: true
      })
      const { owner } = await productsRepository.getProductById(pid)
      if (email === owner) {
        throw new Error("You can't add products you own")
      }

      const productAddedToCart = await cartsRepository.addToCart(
        cid,
        pid,
        quantity
      )
      if (!productAddedToCart) { throw new Error(`Error adding product ${pid} to cart ${cid}`) }

      return productAddedToCart
    } catch (error) {
      throw error
    }
  }

  async updateCart (cid, products) {
    try {
      const updatedCart = await cartsRepository.updateCart(cid, products)
      if (!updatedCart) throw new Error(`Error updating cart ${cid}`)

      return updatedCart
    } catch (error) {
      throw error
    }
  }

  async updateProductFromCart (cid, pid, quantity) {
    try {
      const updatedProductFromCart =
        await cartsRepository.updateProductFromCart(cid, pid, quantity)
      if (!updatedProductFromCart) { throw new Error(`Error updating product ${pid} from cart ${cid}`) }

      return updatedProductFromCart
    } catch (error) {
      throw error
    }
  }

  async deleteCart (cid) {
    try {
      const deletedCart = await cartsRepository.deleteCart(cid)
      if (!deletedCart) throw new Error(`Error deleting cart ${cid}`)

      return deletedCart
    } catch (error) {
      throw error
    }
  }

  async deleteProductFromCart (cid, pid) {
    try {
      const deletedProductFromCart =
        await cartsRepository.deleteProductFromCart(cid, pid)
      if (!deletedProductFromCart) { throw new Error(`Error deleting product ${pid} from cart ${cid}`) }

      return deletedProductFromCart
    } catch (error) {
      throw error
    }
  }
}
