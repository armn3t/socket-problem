import { Message } from "../types"
import { API_BASE_URL, getAuthHeader } from "./api"

import axios from 'axios'

export const deleteMessage = async (message: Message) => {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/message/${message._id}`,
      { headers: getAuthHeader() }
    )
    return res.data
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}
