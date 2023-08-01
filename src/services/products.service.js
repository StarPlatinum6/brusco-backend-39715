import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import { faker } from '@faker-js/faker'
import { productsRepository } from '../repositories/index.js'

import { emailTemplates } from '../mail/templates.js'

const {
  jwt: { JWT_SECRET }
} = config

export default class ProductService {
  constructor (mailService) {
    this.mailService = mailService
  }

  async getProducts (page, limit, category, available, sort) {
    try {
      const products = await productsRepository.getProducts(
        page,
        limit,
        category,
        available,
        sort
      )
      if (!products) throw new Error("Couldn't find products")

      return products
    } catch (error) {
      throw error
    }
  }

  async getProductById (pid) {
    try {
      const filteredProduct = await productsRepository.getProductById(pid)
      if (!filteredProduct) { throw new Error(`Product with id: ${pid} does not exist`) }

      return filteredProduct
    } catch (error) {
      throw error
    }
  }

  async addProduct (
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    token
  ) {
    try {
      const productObj = {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails,
        owner: 'admin'
      }

      const { role, email } = jwt.verify(token, JWT_SECRET, {
        ignoreExpiration: true
      })
      role === 'premium' ? (productObj.owner = email) : null

      const addedProduct = await productsRepository.addProduct(productObj)
      if (!addedProduct) throw new Error('Error adding new product')

      return addedProduct
    } catch (error) {
      throw error
    }
  }

  async updateProduct (updateId, updateProd) {
    try {
      const updatedProduct = await productsRepository.updateProduct(
        updateId,
        updateProd
      )
      if (!updatedProduct) { throw new Error(`Error updating product with id: ${updateId}`) }

      return updatedProduct
    } catch (error) {
      throw error
    }
  }

  async deleteProduct (deleteId, token) {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const { role, email, name } = jwt.verify(token, JWT_SECRET, {
        ignoreExpiration: true
      })

      const { owner, title, _id } = await productsRepository.getProductById(deleteId)
      if (role === 'premium' && email !== owner) {
        throw new Error('You can only delete products you own')
      }

      const deletedProduct = await productsRepository.deleteProduct(deleteId)
      if (!deletedProduct) {
        throw new Error(`Error deleting product with id: ${deleteId}`)
      }

      if (emailRegex.test(owner)) {
        const mail = {
          to: owner,
          subject: 'Ephemer Gaming - Product Deletion Notification',
          html: emailTemplates.productDeletionEmail(owner, title, _id.toString())
        }
        await this.mailService.sendEmail(mail)
      }

      return deletedProduct
    } catch (error) {
      throw error
    }
  }

  async mockingProducts () {
    try {
      const products = []

      const fakeProduct = () => {
        return {
          _id: faker.database.mongodbObjectId(),
          status: faker.datatype.boolean(1),
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          code: faker.string.alphanumeric(16, { casing: 'upper' }),
          price: faker.commerce.price({ min: 5000, max: 2000000, dec: 0 }),
          stock: faker.number.int({ min: 5, max: 100 }),
          category: faker.commerce.department(),
          thumbnails: [faker.image.url(), faker.image.url()]
        }
      }

      for (let i = 0; i < 50; i++) {
        products.push(fakeProduct())
      }

      if (!products) throw new Error('Error creating products mock')
      return products
    } catch (error) {
      throw error
    }
  }
}
