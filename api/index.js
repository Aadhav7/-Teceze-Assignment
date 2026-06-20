let app;
try {
  app = require('../backend/app');
} catch (error) {
  app = require('express')();
  app.all('*', (req, res) => {
    res.status(500).json({
      message: 'Failed to boot backend app',
      error: error.message,
      stack: error.stack
    });
  });
}

module.exports = app;
