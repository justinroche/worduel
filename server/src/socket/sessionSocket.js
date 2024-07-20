const sessionController = require('../controllers/sessionController');

module.exports = (socket, io) => {
  socket.on('createSession', async (uuid, callback) => {
    try {
      let session = await sessionController.createSession();
      session = await sessionController.updateSession(session.sessionCode, {
        player1UUID: uuid,
      });

      // Join the room for the session
      socket.join(session.sessionCode);

      // Notify the client that the session was created
      socket.emit('setSession', session);
      socket.emit('setPlayerIsHost', true);
      console.log('Created new session:', session.sessionCode);
      callback();
    } catch (error) {
      console.log(error);
      callback(error.message);
    }
  });

  socket.on('joinSession', async ([uuid, sessionCode], callback) => {
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
        player2UUID: uuid,
      });

      // Join the room for the session
      socket.join(session.sessionCode);

      // Notify all clients in the room that the user joined the session
      io.to(session.sessionCode).emit('setPlayer2Connected', true);
      socket.emit('setPlayerIsHost', false);
      socket.emit('setSession', session);
      console.log('User joined session', sessionCode);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('rejoinSession', async ([uuid, sessionCode], callback) => {
    try {
      // Check if uuid matches either player
      let session = await sessionController.getSessionFromCode(sessionCode);
      if (session.player1UUID === uuid) {
        // rejoin as host
        socket.join(sessionCode);
        socket.emit('setPlayerIsHost', true);
        socket.emit('setSession', session);
      } else if (session.player2UUID === uuid) {
        // rejoin as player 2
        socket.join(sessionCode);
        socket.emit('setSession', session);
      } else {
        throw new Error('UUID does not match either player');
      }
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
      io.to(sessionCode).emit('goToGameView');
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
      socket.leaveAll();
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('leaveRoom', (callback) => {
    socket.leaveAll();
    callback();
  });

  socket.on(
    'updateGameOption',
    async ([option, value, sessionCode], callback) => {
      try {
        let session = await sessionController.updateSession(sessionCode, {
          [option]: value,
        });
        io.to(sessionCode).emit('setSession', session);
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

      io.to(sessionCode).emit('setSession', session);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on(
    'madeGuess',
    async ([guess, results, playerNumber, sessionCode], callback) => {
      try {
        let session = await sessionController.getSessionFromCode(sessionCode);
        const currentGame = session.games[session.currentRound - 1];
        const currentWord = currentGame.words.find(
          (word) => word.wordSetter !== playerNumber
        );

        currentWord.guesses[currentWord.results.length] = guess;
        currentWord.results.push(results);

        if (currentWord.word === guess || currentWord.results.length === 6) {
          currentWord.guessingComplete = true;

          if (currentWord.word === guess) {
            currentWord.guessedIn = currentWord.results.length;
          } else currentWord.guessedIn = 7;

          if (currentGame.words.every((word) => word.guessingComplete)) {
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

  socket.on('nextRound', async (sessionCode, callback) => {
    try {
      let session = await sessionController.getSessionFromCode(sessionCode);
      session.currentRound += 1;

      session = await sessionController.updateSession(sessionCode, {
        currentRound: session.currentRound,
      });

      io.to(sessionCode).emit('resetLocalRoundState');
      io.to(sessionCode).emit('setSession', session);
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('endGame', async (sessionCode, callback) => {
    try {
      let session = await sessionController.getSessionFromCode(sessionCode);
      session.state = 'complete';

      session = await sessionController.updateSession(sessionCode, {
        state: session.state,
      });

      io.to(sessionCode).emit('resetLocalRoundState');
      io.to(sessionCode).emit('setSession', session);
      io.to(sessionCode).emit('goToSummaryView');
      callback();
    } catch (error) {
      callback(error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
};
