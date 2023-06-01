export default class MessagesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getMessages = async () => {
    try {
      const messages = await this.dao.getMessages();
      return messages;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  saveMessage = async (message) => {
    try {
      const createdMessage = await this.dao.saveMessage(message);
      return createdMessage;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
