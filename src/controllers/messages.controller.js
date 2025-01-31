import { messageService } from '../services/index.js'

export const getMessages = async (req, res) => {
  try {
    const messages = await messageService.getMessages()

    if (!messages) {
      return res
        .status(404)
        .send({ status: 'error', error: 'Messages not found' })
    }

    return res.status(200).send({ status: 'success', payload: messages })
  } catch (error) {
    req.logger.error(`Failed to get messages: ${error}`)
    return res
      .status(500)
      .send({ status: 'error', error: 'Failed to get messages' })
  }
}
