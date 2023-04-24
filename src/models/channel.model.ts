import mongoose, { Document, Model } from 'mongoose'

export interface ChannelDocument extends Document {
  alias: string,
  password: string
  messageCount: number
}

const channelSchema = new mongoose.Schema<ChannelDocument>(
  {
    alias: { type: String, required: true, unique: true },
    password: { type: String },
    messageCount: { type: Number, default: 0 }
  },
  { timestamps: true }
)

const Channel: Model<ChannelDocument> = mongoose.model<ChannelDocument>('Channel', channelSchema)

export default Channel
