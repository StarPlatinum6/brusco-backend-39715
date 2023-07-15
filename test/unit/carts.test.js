import chai from 'chai'
import mongoose from 'mongoose'

import { config } from '../../src/config/config.js'
import { cartMongo } from '../../src/dao/mongo/cart.mongo.js'
import { productMongo } from '../../src/dao/mongo/product.mongo.js'
import { v4 as uuidv4 } from 'uuid'

const expect = chai.expect

describe('Unit test suite for Cart DAO', function () {
  this.timeout(10000)
  this.productId = ''
  this.cartId = ''

  before(function () {
    mongoose.connect(config.db.DB_URL_TEST)
    this.cartsDao = cartMongo
    this.productsDao = productMongo
  })

  after(function () {
    this.productsDao.deleteProduct(this.productId)
  })

  it('createCart creates new cart ID', async function () {
    const result = await this.cartsDao.createCart()
    this.cartId = result._id.toString()
    expect(result).to.have.property('_id')
  })

  it('getCartById returns an existing cart with a valid cart ID input', async function () {
    const result = await this.cartsDao.getCartById(this.cartId)
    expect(result).to.have.property('_id')
  })

  it('addToCart adds a new product to the cart when given a valid cart ID, product ID and quantity', async function () {
    const quantity = 5
    const productMock = {
      title: 'Test Product',
      description: 'This is a Test Product',
      code: uuidv4(),
      price: 10,
      stock: 5,
      category: 'GPU',
      thumbnails: ['image1.jpg', 'image2.jpg']
    }

    const { _id: productId } = await this.productsDao.addProduct(productMock)
    this.productId = productId

    const result = await this.cartsDao.addToCart(
      this.cartId,
      productId,
      quantity
    )

    expect(result.products[0]).to.have.property('productId')
    expect(result.products.length).to.eq(1)
    expect(result.products[0].productId._id).to.deep.eq(productId)
    expect(result.products[0].quantity).to.eq(quantity)
  })

  it('updateCart updates the products array of a cart when given a valid cart ID and products array', async function () {
    const products = [
      {
        productId: this.productId,
        quantity: 14
      }
    ]
    const result = await this.cartsDao.updateCart(this.cartId, products)
    const cartAfter = await this.cartsDao.getCartById(this.cartId)

    expect(result).to.have.property('modifiedCount').eq(1)
    expect(cartAfter.products[0].productId._id).to.deep.eq(
      products[0].productId
    )
    expect(cartAfter.products[0].quantity).to.eq(products[0].quantity)
  })

  it('updateProductFromCart updates the quantity of a product to 0 when given that quantity', async function () {
    const quantity = 0
    const result = await this.cartsDao.updateProductFromCart(
      this.cartId,
      this.productId,
      quantity
    )
    const cartAfter = await this.cartsDao.getCartById(this.cartId)

    expect(result).to.have.property('modifiedCount').eq(1)
    expect(cartAfter.products[0].quantity).to.eq(0)
  })

  it('deleteProductFromCart deletes a product from the cart when given a valid cart ID and product ID', async function () {
    const result = await this.cartsDao.deleteProductFromCart(
      this.cartId,
      this.productId
    )
    const cartAfter = await this.cartsDao.getCartById(this.cartId)

    expect(result).to.have.property('modifiedCount').eq(1)
    expect(cartAfter.products).to.be.deep.eq([])
  })

  it('deleteCart deletes a cart with a valid cart ID input', async function () {
    const result = await this.cartsDao.deleteCart(this.cartId)
    expect(result).to.have.property('deletedCount').eq(1)
  })
})
