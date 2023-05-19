// import MessageManager from "../dao/fileManagers/messageManager.js";
import MessageManager from "../dao/dbManagers/messageManager.js";

const messageManager = new MessageManager();

class MessageService {
  constructor() {}

  async getMessages() {
    try {
      const messages = await messageManager.getMessages();

      return messages || [];
    } catch (error) {
      console.log(`Failed to get messages with error: ${error}`);
      throw error;
    }
  }
}

export const messagesService = new MessageService();
