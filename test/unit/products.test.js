import chai from 'chai'
import mongoose from 'mongoose'

import { config } from '../../src/config/config.js'
import { productMongo } from '../../src/dao/mongo/product.mongo.js'
import { v4 as uuidv4 } from 'uuid'

const expect = chai.expect

describe('Unit test suite for Product DAO', function () {
  this.timeout(10000)
  this.productId = ''

  before(function () {
    mongoose.connect(config.db.DB_URL_TEST)
    this.productsDao = productMongo
  })

  it('addProduct creates new product with valid input', async function () {
    const productMock = {
      title: 'Test Product',
      description: 'This is a Test Product',
      code: uuidv4(),
      price: 10,
      stock: 5,
      category: 'GPU',
      thumbnails: ['image1.jpg', 'image2.jpg']
    }
    const result = await this.productsDao.addProduct(productMock)

    this.productId = result._id.toString()

    expect(result).to.have.property('_id')
  })

  it('getProducts returns an array of products', async function () {
    const { docs } = await this.productsDao.getProducts()

    expect(docs).to.be.a('array')
  })

  it('getProducts returns expected products with valid input', async function () {
    const result = await this.productsDao.getProducts(1, 5, 'GPU', 'true', 1)

    expect(result.docs.length).to.be.greaterThan(0)
  })

  it('getProductById returns expected product with valid input', async function () {
    const result = await this.productsDao.getProductById(this.productId)

    expect(result).to.have.property('_id')
  })

  it('updateProduct modifies a product successfully with valid input', async function () {
    const result = await this.productsDao.updateProduct(this.productId, {
      category: 'TEST'
    })
    const productAfter = await this.productsDao.getProductById(this.productId)

    expect(result).to.have.property('modifiedCount').eq(1)
    expect(productAfter.category).to.eq('TEST')
  })

  it('deleteProduct deletes a product successfully with valid input', async function () {
    const result = await this.productsDao.deleteProduct(this.productId)
    const productsAfter = await this.productsDao.getProducts()

    expect(result).to.have.property('deletedCount').eq(1)
    expect(productsAfter.docs).to.be.deep.eq([])
  })
})
