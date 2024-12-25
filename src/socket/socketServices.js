let io;

module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Can't retrieve io instance before calling init.");
    }
    return io;
  }
}