import jwt from 'jsonwebtoken'

export async function signToken( userId: string ): Promise<string> {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET)

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
