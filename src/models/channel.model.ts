import mongoose, { Document, Model } from 'mongoose'

export interface ChannelDocument extends Document {
  alias: string,
  protected: boolean,
  password: string
  messageCount: number
}

const channelSchema = new mongoose.Schema<ChannelDocument>(
  {
    alias: { type: String, required: true, unique: true },
    protected: { type: Boolean, default: false },
    password: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
)

channelSchema.pre('save', function () {
  if (this.password) this.protected = true
})

const Channel: Model<ChannelDocument> = mongoose.model<ChannelDocument>('Channel', channelSchema)

export default Channel
