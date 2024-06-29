const sessionController = require('../controllers/sessionController');

module.exports = (socket, io) => {
  socket.on('createSession', async (callback) => {
    try {
      const session = await sessionController.createSession(); // Create a new session
      socket.join(session.sessionCode); // Join the room for the session
      socket.emit('sessionCreated', session); // Notify the client that the session was created
      callback(); // Indicate success to the client
    } catch (error) {
      callback(error.message); // Send error message to the client
    }
  });

  socket.on('joinSession', async (sessionCode, callback) => {
    try {
      // Check if the session exists and is joinable
      let session = await sessionController.getSessionFromCode(sessionCode);
      if (session.state !== 'in lobby') {
        throw new Error('Session is not in lobby');
      }
      if (session.player2Connected) {
        throw new Error('Session is full');
      }

      // Update the session to indicate that player 2 has connected
      session = await sessionController.updateSession(sessionCode, {
        player2Connected: true,
      });
      socket.join(session.sessionCode); // Join the room for the session
      io.to(session.sessionCode).emit('sessionJoined', session); // Notify all clients in the room
      callback(); // Indicate success to the client
    } catch (error) {
      callback(error.message); // Send error message to the client
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
};
