import bcrypt from 'bcryptjs'
import Channel, { ChannelDocument } from "../models/channel.model";

export const channelAuthenticated = async (channel: ChannelDocument, password: string): Promise<boolean> => {
  console.log(channel, password, 'WTF1')
  if (!password) return false

  const dbChannel = await Channel.findById(channel._id).exec()
  console.log(dbChannel, 'WTF2')

  const isPasswordMatch = await bcrypt.compare(password, dbChannel.password);
  console.log(isPasswordMatch, 'WTF3')

  return isPasswordMatch
}