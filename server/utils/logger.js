import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, '../logs');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'app.log');

const logger = {
  log: (message, level = 'INFO') => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    // Console output
    console.log(logMessage);
    
    // File output
    fs.appendFileSync(logFile, logMessage);
  },
  
  error: (message, error) => {
    const errorDetails = error ? `\nError: ${error.message}\nStack: ${error.stack}` : '';
    logger.log(`${message}${errorDetails}`, 'ERROR');
  },
  
  request: (req) => {
    logger.log(`${req.method} ${req.url}`, 'REQUEST');
  }
};

export default logger; 