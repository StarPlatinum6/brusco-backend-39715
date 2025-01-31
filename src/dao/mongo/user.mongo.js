import { userModel } from './models/user.model.js'

class User {
  constructor () {}

  getUsers = async () => {
    try {
      const users = await userModel.find().lean()
      return users
    } catch (error) {
      console.log(error)
    }
  }

  getUser = async (query) => {
    try {
      const user = await userModel.findOne(query)
      return user
    } catch (error) {
      console.log(error)
    }
  }

  getUserByCartId = async (cartId) => {
    try {
      const user = await userModel.findOne({ cart: cartId })
      return user
    } catch (error) {
      console.log(error)
    }
  }

  registerUser = async (user) => {
    try {
      const newUser = await userModel.create(user)
      return newUser
    } catch (error) {
      console.log(error)
    }
  }

  updateUser = async (query, update) => {
    try {
      const updatedUser = await userModel.updateOne(query, update)
      return updatedUser
    } catch (error) {
      console.log(error)
    }
  }

  deleteUser = async (userId) => {
    try {
      const deletedUser = await userModel.deleteOne({ _id: userId })
      return deletedUser
    } catch (error) {
      console.log(error)
    }
  }

  deleteUserByCartId = async (cartId) => {
    try {
      const deletedUser = await userModel.deleteOne({ cart: cartId })
      return deletedUser
    } catch (error) {
      console.log(error)
    }
  }

  deleteInactiveUsers = async (users) => {
    try {
      const deletedUser = await userModel.deleteMany({ cart: { $in: users } })
      return deletedUser
    } catch (error) {
      console.log(error)
    }
  }
}

export const userMongo = new User()
