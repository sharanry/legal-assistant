const logger = {
  log: (message) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },

  error: (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error(error);
    }
  },

  request: (req) => {
    console.log(`[REQUEST] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
};

export default logger; 