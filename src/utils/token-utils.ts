import { UserRoles } from './../models/user.model';
import jwt from 'jsonwebtoken'
import { UserDocument } from '../models/user.model'

export async function signToken( user: UserDocument ): Promise<string> {

  const { _id, email, role } = user

  const token = jwt.sign({ userId: _id.toString(), username: email, role }, process.env.JWT_SECRET)

  return token
}

export async function decodeToken(token: string): Promise<any | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error: unknown) {
    console.error('Error decoding token', token)
    return null
  }
}
