const sessionController = require('../controllers/sessionController');

module.exports = (socket, io) => {
  socket.on('createSession', async (callback) => {
    try {
      const session = await sessionController.createSession();

      // Join the room for the session
      socket.join(session.sessionCode);

      // Notify the client that the session was created
      socket.emit('sessionCreated', session);
      console.log('Created new session:', session.sessionCode);
      callback();
    } catch (error) {
      callback(error.message);
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

      // Join the room for the session
      socket.join(session.sessionCode);

      // Notify all clients in the room that the user joined the session
      io.to(session.sessionCode).emit('sessionJoined', session);
      console.log('User joined session', sessionCode);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('updatePlayer1Name', async ([name, sessionCode], callback) => {
    try {
      await sessionController.updateSession(sessionCode, { player1Name: name });
      io.to(sessionCode).emit('player1NameUpdated', name);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('updatePlayer2Name', async ([name, sessionCode], callback) => {
    try {
      await sessionController.updateSession(sessionCode, { player2Name: name });
      io.to(sessionCode).emit('player2NameUpdated', name);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('updateRounds', async ([rounds, sessionCode], callback) => {
    try {
      await sessionController.updateSession(sessionCode, { rounds });
      io.to(sessionCode).emit('roundsUpdated', rounds);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on(
    'updateSpellCheckEnabled',
    async ([enabled, sessionCode], callback) => {
      try {
        await sessionController.updateSession(sessionCode, {
          spellCheckEnabled: enabled,
        });
        io.to(sessionCode).emit('spellCheckEnabledUpdated', enabled);
        callback();
      } catch (error) {
        callback(error.message);
      }
    }
  );

  socket.on(
    'updateBlockProfanityEnabled',
    async ([enabled, sessionCode], callback) => {
      try {
        await sessionController.updateSession(sessionCode, {
          blockProfanityEnabled: enabled,
        });
        io.to(sessionCode).emit('blockProfanityEnabledUpdated', enabled);
        callback();
      } catch (error) {
        callback(error.message);
      }
    }
  );

  socket.on(
    'updateRoundTimerEnabled',
    async ([enabled, sessionCode], callback) => {
      try {
        await sessionController.updateSession(sessionCode, {
          roundTimerEnabled: enabled,
        });
        io.to(sessionCode).emit('roundTimerEnabledUpdated', enabled);
        callback();
      } catch (error) {
        callback(error.message);
      }
    }
  );

  socket.on(
    'updateRoundTimerDuration',
    async ([duration, sessionCode], callback) => {
      try {
        await sessionController.updateSession(sessionCode, {
          roundTimerDuration: duration,
        });
        io.to(sessionCode).emit('roundTimerDurationUpdated', duration);
        callback();
      } catch (error) {
        callback(error.message);
      }
    }
  );

  socket.on('exitSession', async ([playerNumber, sessionCode], callback) => {
    try {
      socket.leave(sessionCode);

      let session = await sessionController.getSessionFromCode(sessionCode);

      if (playerNumber === 1) {
        if (!session.player2Connected) {
          sessionController.closeSession(sessionCode);
          console.log('Closed session', sessionCode);
        } else {
          session = await sessionController.updateSession(sessionCode, {
            player2Connected: false,
            player1Name:
              session.player2Name === 'Player 2'
                ? 'Player 1'
                : session.player2Name,
            player2Name: 'Player 2',
          });

          io.to(sessionCode).emit('player1Disconnected', session);
          console.log('Host left', sessionCode);
        }
      } else if (playerNumber === 2) {
        await sessionController.updateSession(sessionCode, {
          player2Connected: false,
          player2Name: 'Player 2',
        });
        io.to(sessionCode).emit('player2Disconnected');
        console.log('Player 2 left', sessionCode);
      }
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
};
