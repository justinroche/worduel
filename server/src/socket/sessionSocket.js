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

  socket.on('updatePlayer1Name', ([name, sessionCode], callback) => {
    try {
      sessionController.updateSession(sessionCode, { player1Name: name });
      io.to(sessionCode).emit('player1NameUpdated', name);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('updatePlayer2Name', ([name, sessionCode], callback) => {
    try {
      sessionController.updateSession(sessionCode, { player2Name: name });
      io.to(sessionCode).emit('player2NameUpdated', name);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('updateRounds', ([rounds, sessionCode], callback) => {
    try {
      sessionController.updateSession(sessionCode, { rounds });
      io.to(sessionCode).emit('roundsUpdated', rounds);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('updateSpellCheckEnabled', ([enabled, sessionCode], callback) => {
    try {
      sessionController.updateSession(sessionCode, {
        spellCheckEnabled: enabled,
      });
      io.to(sessionCode).emit('spellCheckEnabledUpdated', enabled);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on(
    'updateBlockProfanityEnabled',
    ([enabled, sessionCode], callback) => {
      try {
        sessionController.updateSession(sessionCode, {
          blockProfanityEnabled: enabled,
        });
        io.to(sessionCode).emit('blockProfanityEnabledUpdated', enabled);
        callback();
      } catch (error) {
        callback(error.message);
      }
    }
  );

  socket.on('updateRoundTimerEnabled', ([enabled, sessionCode], callback) => {
    try {
      sessionController.updateSession(sessionCode, {
        roundTimerEnabled: enabled,
      });
      io.to(sessionCode).emit('roundTimerEnabledUpdated', enabled);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('updateRoundTimerDuration', ([duration, sessionCode], callback) => {
    try {
      sessionController.updateSession(sessionCode, {
        roundTimerDuration: duration,
      });
      io.to(sessionCode).emit('roundTimerDurationUpdated', duration);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('exitSession', ([playerNumber, sessionCode], callback) => {
    // TODO: remove players from the socket io room once they disconnect
    try {
      const session = sessionController.getSessionFromCode(sessionCode);
      if (playerNumber === 1) {
        if (!session.player2Connected) {
          sessionController.closeSession(sessionCode);
        } else {
          io.to(sessionCode).emit('player1Disconnected');
          sessionController.updateSession(sessionCode, {
            player2Connected: false,
          });
          sessionController.updateSession(sessionCode, {
            player1Name: session.player2Name,
          });
        }
        callback();
      } else if (playerNumber === 2) {
        sessionController.updateSession(sessionCode, {
          player2Connected: false,
        });
        sessionController.updateSession(sessionCode, {
          player2Name: 'Player 2',
        });
        io.to(sessionCode).emit('player2Disconnected');
        callback();
      }
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
};
