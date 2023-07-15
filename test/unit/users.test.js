import chai from 'chai'
import mongoose from 'mongoose'

import { config } from '../../src/config/config.js'
import { userMongo } from '../../src/dao/mongo/user.mongo.js'
import { v4 as uuidv4 } from 'uuid'

const expect = chai.expect

describe('Unit test suite for User DAO', function () {
  this.timeout(10000)
  this.userId = ''
  this.userCartId = ''

  before(function () {
    mongoose.connect(config.db.DB_URL_TEST)
    this.usersDao = userMongo
  })

  after(function () {
    mongoose.connection.collections.users.drop()
  })

  it('registerUser creates new user with valid input', async function () {
    const userMock = {
      email: `${uuidv4()}@hotmail.com`,
      password: '778899',
      cart: '6460770e9d94f3d716abd6a9'
    }
    const result = await this.usersDao.registerUser(userMock)

    this.userId = result._id.toString()
    this.userCartId = result.cart.toString()

    expect(result).to.have.property('_id')
  })

  it('getUser returns an existing user with a valid user ID input', async function () {
    const result = await this.usersDao.getUser({ _id: this.userId })
    expect(result).to.have.property('email')
  })

  it('getUserByCartId returns an existing user with a valid cart ID input', async function () {
    const result = await this.usersDao.getUserByCartId(this.userCartId)
    expect(result).to.have.property('email')
  })

  it('updateUser updates an existing user with a valid input', async function () {
    const result = await this.usersDao.updateUser(
      { _id: this.userId },
      { password: '123' }
    )
    const userAfter = await this.usersDao.getUser({ _id: this.userId })

    expect(userAfter.password).to.be.eq('123')
    expect(result).to.have.property('modifiedCount').eq(1)
  })
})
