module.exports = (io, socket) => {
    // Xử lý sự kiện chat ở đây
  socket.on('send_message', (message) => {
    console.log(message.comment);
    
      // io.emit('receive_message', message);
    });
  };