import { Request, Response } from 'express';
import Channel, { ChannelDocument } from '../models/channel.model';

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
  }
}

export default channelController
