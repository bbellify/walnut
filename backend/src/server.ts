import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import dashboardRouter from './routes/dashboard';
import BlockSubscriber from './services/zeromq';

dotenv.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const ZMQ_HASH_BLOCK_URL = process.env.ZMQ_HASH_BLOCK_URL as string;
const DEV_ORIGIN = process.env.DEV_ORIGIN;

const server: Express = express();
server.use(express.json());
// allowing origin in .env for dev
server.use(
  cors({
    origin: DEV_ORIGIN,
    methods: ['GET', 'POST']
  })
);

new BlockSubscriber(ZMQ_HASH_BLOCK_URL);

server.use(express.static(path.join(__dirname, '../../client/dist')));

server.get('/health', (_req: Request, res: Response) => {
  res.send('OK');
});

server.use('/dashboard', dashboardRouter);

server.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Walnut API running on port ${PORT}`);
  console.log('Listening for new blocks...');
});
