import { createProxyMiddleware } from 'http-proxy-middleware'
import { SERVER_URL } from './api/api'

export default function(app: any) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: SERVER_URL,
      secure: false,
      changeOrigin: true
    })
  )
}