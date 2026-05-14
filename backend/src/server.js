import http from 'http';
import { initSocket } from './config/socket.js';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
