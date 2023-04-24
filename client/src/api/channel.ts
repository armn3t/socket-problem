import { Channel } from "../types"
import { API_BASE_URL } from "./url"

import axios from 'axios'


function getAuthHeader() {
  const token = localStorage.getItem('_auth')
  return { 'Authorization': `Bearer ${token}`}
}

export const fetchChannels = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/channel`, { headers: getAuthHeader() })
    return res.data
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export const fetchStatistics = async (channel: Channel) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/channel/${channel._id}`, { headers: getAuthHeader() })
    console.log('CHANNEL STATS', res.data)
    return res.data
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export const createChannel = async (alias: string, password: string) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/channel`, { alias }, { headers: getAuthHeader() })
    return res.data
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}
