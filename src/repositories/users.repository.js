export default class UsersRepository {
  constructor (dao) {
    this.dao = dao
  }

  getUsers = async () => {
    try {
      const users = await this.dao.getUsers()
      return users
    } catch (error) {
      console.log(error)
      return null
    }
  }

  getUser = async (query) => {
    try {
      const user = await this.dao.getUser(query)
      return user
    } catch (error) {
      console.log(error)
      return null
    }
  }

  getUserByCartId = async (cartId) => {
    try {
      const user = await this.dao.getUserByCartId(cartId)
      return user
    } catch (error) {
      console.log(error)
      return null
    }
  }

  registerUser = async (user) => {
    try {
      const newUser = await this.dao.registerUser(user)
      return newUser
    } catch (error) {
      console.log(error)
      return null
    }
  }

  updateUser = async (query, update) => {
    try {
      const updatedUser = await this.dao.updateUser(query, update)
      return updatedUser
    } catch (error) {
      console.log(error)
      return null
    }
  }

  deleteUser = async (userId) => {
    try {
      const deletedUser = await this.dao.deleteUser(userId)
      return deletedUser
    } catch (error) {
      console.log(error)
      return null
    }
  }

  deleteUserByCartId = async (cartId) => {
    try {
      const deletedUser = await this.dao.deleteUserByCartId(cartId)
      return deletedUser
    } catch (error) {
      console.log(error)
      return null
    }
  }

  deleteInactiveUsers = async (users) => {
    try {
      const deletedUsers = await this.dao.deleteInactiveUsers(users)
      return deletedUsers
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
