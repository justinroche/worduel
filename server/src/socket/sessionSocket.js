const sessionController = require('../controllers/sessionController');

module.exports = (socket, io) => {
  socket.on('createSession', async (callback) => {
    try {
      const session = await sessionController.createSession();

      // Join the room for the session
      socket.join(session.sessionCode);

      // Notify the client that the session was created
      socket.emit('setSession', session);
      socket.emit('sessionCreated');
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

  socket.on('startGame', async (sessionCode, callback) => {
    try {
      let session = await sessionController.getSessionFromCode(sessionCode);

      // Create the initial game objects
      const games = Array.from({ length: session.rounds }, (_, index) => ({
        id: index,
        state: 'setting word',
        words: [],
      }));

      // Update the session
      session = await sessionController.updateSession(sessionCode, {
        state: 'in play',
        currentRound: 1,
        games: games,
      });

      io.to(sessionCode).emit('setSession', session);
      io.to(sessionCode).emit('gameStarted');
      console.log(sessionCode, 'game started');
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('kickPlayer2', async (sessionCode, callback) => {
    try {
      await sessionController.updateSession(sessionCode, {
        player2Connected: false,
        player2Name: 'Player 2',
      });
      io.to(sessionCode).emit('removePlayer2');
      console.log('Player 2 kicked from', sessionCode);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('exitSession', async ([playerNumber, sessionCode], callback) => {
    try {
      let session = await sessionController.getSessionFromCode(sessionCode);

      if (playerNumber === 1) {
        if (!session.player2Connected) {
          // Close the session if no other player is present
          sessionController.closeSession(sessionCode);
          console.log('Closed session', sessionCode);
        } else {
          // Otherwise promote player 2 to player 1
          session = await sessionController.updateSession(sessionCode, {
            player2Connected: false,
            player1Name:
              session.player2Name === 'Player 2'
                ? 'Player 1'
                : session.player2Name,
            player2Name: 'Player 2',
          });
        }
        // Emit player 1 disconnected
        io.to(sessionCode).emit('player1Disconnected', session);
        console.log('Host left', sessionCode);
      } else if (playerNumber === 2) {
        // Disconnect player 2 from the session
        await sessionController.updateSession(sessionCode, {
          player2Connected: false,
          player2Name: 'Player 2',
        });

        // Emit player 2 disconnected
        io.to(sessionCode).emit('player2Disconnected');
        console.log('Player 2 left', sessionCode);
      }

      // Leave the room for the session
      socket.leave(sessionCode);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('leaveRoom', (sessionCode, callback) => {
    socket.leave(sessionCode);
    callback();
  });

  /* Game option events */
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

  /* Game events */
  socket.on('setWord', async ([word, playerNumber, sessionCode], callback) => {
    try {
      let session = await sessionController.getSessionFromCode(sessionCode);
      const currentGame = session.games[session.currentRound - 1];

      if (playerNumber === 1) {
        currentGame.words.push({ wordSetter: 1, word });
      } else if (playerNumber === 2) {
        currentGame.words.push({ wordSetter: 2, word });
      }

      if (currentGame.words.length === 2) {
        currentGame.state = 'in play';
      }

      session = await sessionController.updateSession(sessionCode, {
        games: session.games,
      });

      if (currentGame.state === 'in play') {
        io.to(sessionCode).emit('setSession', session);
      }
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('changeWord', async ([playerNumber, sessionCode], callback) => {
    try {
      let session = await sessionController.getSessionFromCode(sessionCode);
      const currentGame = session.games[session.currentRound - 1];

      currentGame.words = currentGame.words.filter(
        (word) => word.wordSetter !== playerNumber
      );

      session = await sessionController.updateSession(sessionCode, {
        games: session.games,
      });

      io.to(sessionCode).emit('setSession', session);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on(
    'madeGuess',
    async ([guess, playerNumber, sessionCode], callback) => {
      try {
        let session = await sessionController.getSessionFromCode(sessionCode);
        const currentGame = session.games[session.currentRound - 1];
        const currentWord = currentGame.words.find(
          (word) => word.wordSetter !== playerNumber
        );

        currentWord.guesses.push(guess);

        if (currentWord.word === guess) {
          currentWord.successfullyGuessed = true;
          currentWord.guessedIn = playerNumber;

          if (currentGame.words.every((word) => word.successfullyGuessed)) {
            currentGame.state = 'complete';
          }
        }

        session = await sessionController.updateSession(sessionCode, {
          games: session.games,
        });

        io.to(sessionCode).emit('setSession', session);
        callback();
      } catch (error) {
        callback(error.message);
      }
    }
  );

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
};
