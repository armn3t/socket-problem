import { Request, Response } from 'express'
import Message from '../models/message.model'

const messageController = {
  async delete(req: Request, res: Response) {
    try {
      const _id = req.params

      await Message.deleteOne(_id)

      res.json({ message: 'Successfully deleted message' })
    } catch (error: unknown) {
      res.status(500).json({ message: 'Could not delete message' })
    }

  }
}

export default messageController
