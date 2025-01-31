import { messageModel } from './models/messages.model.js'
import socket from '../../socket.js'

class Message {
  constructor () {}

  getMessages = async () => {
    try {
      const messages = await messageModel.find().lean()
      return messages
    } catch (error) {
      console.log(error)
    }
  }

  saveMessage = async (message) => {
    try {
      const createdMessage = await messageModel.create(message)
      socket.io.emit('message_add', createdMessage)
      return createdMessage
    } catch (error) {
      console.log(error)
    }
  }
}

export const messageMongo = new Message()
