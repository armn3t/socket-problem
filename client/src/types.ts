
export interface Message {
  _id: string
  content: string
  user: {
    email: string
  }
  createdAt: string
  channel: string
}

export interface Channel {
  _id: string
  alias: string
  createdAt: string
  protected: boolean
}

export interface ChannelData {
  messages: Message[],
  channelUsers: Set<string>
}

export interface ChannelStatistics {
  messages: Message[]
  messageCount: number
}

export interface SocketUserPayload {
  socketId: string
  userId: string
  username: string
}

export interface ChatUsers {
  userId: string
  socketId: string
}

export interface ChannelJoinedPayload {
  messages: Message[]
  channel: Channel
  channelUsers: Set<string>
}

export interface UserJoinedChannelPayload {
  alias: string
  socketId: string
}

export interface MessageReceivedPayload {
  message: Message
  alias: string
}

export enum UserRoles {
  Standar,
  Admin
}