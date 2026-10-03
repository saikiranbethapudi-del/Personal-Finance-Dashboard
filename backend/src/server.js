import os from 'os';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

const getNetworkIPs = () => {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
};

// Connect to MongoDB
connectDB().then(() => {
  const server = app.listen(PORT, HOST, () => {
    console.log(`--------------------------------------------------------`);
    console.log(`Backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}:`);
    console.log(`  > Local:   http://localhost:${PORT}`);
    const networkIPs = getNetworkIPs();
    if (networkIPs.length > 0) {
      networkIPs.forEach((ip) => {
        console.log(`  > Network: http://${ip}:${PORT}`);
      });
    } else {
      console.log(`  > Network: http://${HOST}:${PORT}`);
    }
    console.log(`--------------------------------------------------------`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please check running processes or configure a different PORT in .env.`);
      process.exit(1);
    } else {
      console.error(`Server error: ${err.message}`);
    }
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
});
