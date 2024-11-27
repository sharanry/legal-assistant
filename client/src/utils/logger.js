const logger = {
  log: (message, data = null) => {
    const logMessage = data ? `${message}: ${JSON.stringify(data)}` : message;
    console.log(`[${new Date().toISOString()}] ${logMessage}`);
  },

  error: (message, error = null) => {
    const errorMessage = error ? `${message}: ${error.message}` : message;
    console.error(`[${new Date().toISOString()}] ERROR: ${errorMessage}`);
    if (error?.stack) {
      console.error(error.stack);
    }
  }
};

export default logger; 