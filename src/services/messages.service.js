import { messagesRepository } from "../dao/repositories/messages.repository.js";

class MessageService {
  constructor() {}

  async getMessages() {
    try {
      const messages = await messagesRepository.getMessages();

      return messages || [];
    } catch (error) {
      console.log(`Failed to get messages with error: ${error}`);
      throw error;
    }
  }
}

export const messagesService = new MessageService();
