import { Request, Response } from 'express'
import Channel, { ChannelDocument } from '../models/channel.model'
import Message from '../models/message.model'

const channelController = {
  async fetch(req: Request, res: Response) {
    const channels = await Channel.find().exec()
    res.json({ channels })
  },

  async create(req: Request, res: Response) {
    try {
      const { alias } = req.body
      const newChannel: ChannelDocument = new Channel({ alias })
      newChannel.save()
  
      res.json({ message: 'New channel created successfully', newChannel })
    } catch (error) {
      res.status(500).json({ message: 'Failed creating new channel' })
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { alias, _id } = req.body

      await Message.find({ channel: _id }).deleteMany()
      await Channel.deleteOne({ _id })

      res.json({ message: 'Channel and all its messages deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: `Failed deleting channel: ${req.body._id}` })      
    }
  },

  async statistics(req: Request, res: Response) {
    try {
      const { _id } = req.params

      const date = new Date()
      date.setMinutes(date.getMinutes() - 5)

      const messages = await Message
        .find({ channel: _id, createdAt: { $gte: date } })
        .populate('user').exec()

      const messageCount = await Message.find({ channel: _id }).count().exec()

      res.json({
        message: 'fetched channel',
        messages,
        messageCount
      })
    } catch (error) {
      res.status(500).json({ message: `Failed deleting channel: ${req.body._id}` })      
    }
  }
}

export default channelController
