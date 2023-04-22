import mongoose, { model, Document, Model, Schema} from 'mongoose'

import User, { UserDocument } from './user.model'
import Channel, { ChannelDocument } from './channel.model'

export interface MessageDocument extends Document {
  content: string,
  user: UserDocument,
  channel: ChannelDocument
}

const messageSchema = new Schema<MessageDocument>(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
  },
  { timestamps: true }
)

const Message: Model<MessageDocument> = model<MessageDocument>('Message', messageSchema)

export default Message
