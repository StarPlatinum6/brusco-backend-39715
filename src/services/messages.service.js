import { messagesRepository } from '../repositories/index.js'

export default class MessageService {
  constructor () {}

  async getMessages () {
    try {
      const messages = await messagesRepository.getMessages()
      if (!messages) throw new Error('Error: No messages found')

      return messages || []
    } catch (error) {
      throw error
    }
  }
}
