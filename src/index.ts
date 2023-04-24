import express, { Request, Response } from 'express';
import { createServer } from 'http'
import { Server as IOServer } from 'socket.io'
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router';

import socketWrapper, { InterEvents, ListenEvents, ServerEvents, SocketData } from './socket/socket.wrapper';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

app.use('/api', router);

const httpServer = createServer(app)
const io = new IOServer<ListenEvents, ServerEvents, InterEvents, SocketData>(
  httpServer,
  {
    cors: {
      origin: 'http://localhost:4000'
    }
  }
)

httpServer.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

socketWrapper(io)
