export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUser = async (query) => {
    try {
      const user = await this.dao.getUser(query);
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getUserByCartId = async (cartId) => {
    try {
      const user = await this.dao.getUserByCartId(cartId);
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  registerUser = async (user) => {
    try {
      const newUser = await this.dao.registerUser(user);
      return newUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateUser = async (query, update) => {
    try {
      const updatedUser = await this.dao.updateUser(query, update);
      return updatedUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
