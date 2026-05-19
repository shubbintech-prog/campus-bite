import http from 'http';
import { initSocket } from './config/socket.js';
import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

// Render Keep-Alive job: Ping the public health endpoint every 14 minutes to prevent the free container from sleeping
const startKeepAliveJob = () => {
  const url = process.env.RENDER_EXTERNAL_URL;
  if (!url) {
    console.log("Render Keep-Alive: RENDER_EXTERNAL_URL environment variable is not defined. Skipping self-ping job.");
    return;
  }

  console.log(`Render Keep-Alive: Initializing active self-ping task targeting: ${url}/health`);
  
  // Ping immediately on start
  axios.get(`${url}/health`)
    .then(() => console.log('Render Keep-Alive: Initial startup self-ping successful.'))
    .catch((err) => console.error('Render Keep-Alive: Startup self-ping failed:', err.message));

  // Ping every 14 minutes (840000 ms)
  setInterval(() => {
    axios.get(`${url}/health`)
      .then(() => console.log('Render Keep-Alive: Periodic active ping dispatched successfully.'))
      .catch((err) => console.error('Render Keep-Alive: Periodic ping failed:', err.message));
  }, 14 * 60 * 1000);
};

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startKeepAliveJob();
  });
});
