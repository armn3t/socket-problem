import { readFileSync } from 'fs'
import { join } from 'path'
import express, { Request, Response } from 'express';
import { createServer } from 'http'
import { createServer as createHttpsServer } from 'https'
import { Server as IOServer } from 'socket.io'
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router';

import socketWrapper, { InterEvents, ListenEvents, ServerEvents, SocketData } from './socket/socket.wrapper';

const secure = !!+process.env.SECURE

const options = {
  key: readFileSync(join(process.cwd(), 'ssl', 'key.pem')),
  cert: readFileSync(join(process.cwd(), 'ssl', 'cert.pem'))
}

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(join(process.cwd(), 'client', 'build')))



mongoose.connect(process.env.MONGODB_URI);

app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'client', 'build', 'index.html'))
})

const httpServer = secure ? createHttpsServer(options, app) : createServer(app)
const io = new IOServer<ListenEvents, ServerEvents, InterEvents, SocketData>(
  httpServer,
  {
    cors: {
      origin: 'http://localhost:4000'
    },
  }
)

httpServer.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

socketWrapper(io)
