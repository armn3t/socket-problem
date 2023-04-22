import { Request, Response, NextFunction } from "express";

import { decodeToken } from "../utils/token-utils";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' })
  console.log(authHeader, 'HEADER')
  const token = authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  console.log(token, 'TOKEN')

  const decoded = await decodeToken(token)
  console.log(decoded, 'DECODED')

  if (!decoded?.userId) return res.status(401).json({ message: 'Unathorized' })

  next()
}
