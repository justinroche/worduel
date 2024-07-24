import sessionController from '../controllers/sessionController.js';
import { Server as IOServer, Socket as IOSocket } from 'socket.io';
import { Word, Session } from '../models/sessionModel.js';
import {
  logEvent,
  logInfo,
  logAction,
  logError,
} from '../logging/loggingUtils.js';

export default (socket: IOSocket, io: IOServer) => {
  /* Session and lobby events */
  // Create session -> called when player hosts a game
  socket.on('createSession', async (uuid, callback) => {
    try {
      logEvent('User hosted a session');
      // Create session and set host uuid
      let session = await sessionController.createSession();
      session = await sessionController.updateSession(session.sessionCode, {
        player1UUID: uuid,
        player1SocketId: socket.id,
      });

      // Join the room for the session
      socket.join(session.sessionCode);

      // Set the client's session and host status
      socket.emit('setSession', session);
      socket.emit('setPlayerIsHost', true);

      logAction('Created session: ' + session.sessionCode);
      callback();
    } catch (error: any) {
      logError(error.message);
      callback(error.message);
    }
  });

  // Join session -> called when player joins game or opens a link
  // Handle joining and rejoining sessions
  socket.on('joinSession', async ([uuid, sessionCode], callback) => {
    try {
      logEvent('User requested to join session ' + sessionCode);
      // Check if the session exists and is joinable
      let session = await sessionController.getSessionFromCode(sessionCode);
      if (!session) {
        throw new Error('Session does not exist');
      }
      if (session.state === 'complete') {
        throw new Error('Session is complete');
      }
      if (session.state === 'in lobby') {
        if (session.player2Connected) {
          throw new Error('Session is full');
        }
        if (session.player1UUID === uuid) {
          throw new Error('User may not connect to their own session');
        }

        // Update the session to indicate that player 2 has connected
        session = await sessionController.updateSession(sessionCode, {
          player2Connected: true,
          player2UUID: uuid,
          player2SocketId: socket.id,
        });

        // Join the room for the session
        socket.join(session.sessionCode);

        // Emit the session and player 2 status
        io.to(session.sessionCode).emit('setSession', session);
        socket.emit('setPlayerIsHost', false);
        socket.emit('goToLobbyView');

        logAction('User successfully joined session ' + session.sessionCode);
        callback();
      } else {
        // Ensure the session can be rejoined
        const room = io.sockets.adapter.rooms.get(sessionCode);
        if (!room) {
          throw new Error('Room does not exist');
        }
        if (room.size > 1) {
          throw new Error('Room is full');
        }

        // Attempt to rejoin the session
        if (session.player1UUID === uuid) {
          // Rejoin as host
          session = await sessionController.updateSession(sessionCode, {
            player1SocketId: socket.id,
          });

          // Join the room for the session
          socket.join(sessionCode);

          // Get words
          const currentGame = session.games[session.currentRound - 1];
          const wordThisPlayerIsGuessing = currentGame.words.filter(
            (word: Word) => word.wordSetter === 2
          )[0];
          const wordThisPlayerSet = currentGame.words.filter(
            (word: Word) => word.wordSetter === 1
          )[0];

          // Emit local round state if words have been set
          if (wordThisPlayerIsGuessing) {
            socket.emit(
              'rejoinSetWordThisPlayerIsGuessingLocalRoundState',
              wordThisPlayerIsGuessing.guesses,
              wordThisPlayerIsGuessing.results
            );
          }
          if (wordThisPlayerSet) {
            socket.emit(
              'rejoinSetWordThisPlayerSetLocalRoundState',
              wordThisPlayerSet.word
            );
          }

          // Emit the session, host status, and rejoin event
          socket.emit('setSession', session);
          socket.emit('setPlayerIsHost', true);
          socket.emit('goToGameView');
          io.to(sessionCode).emit('opponentRejoined');

          logAction('Host successfully rejoined session ' + sessionCode);
          callback();
        } else if (session.player2UUID === uuid) {
          // Rejoin as player 2
          session = await sessionController.updateSession(sessionCode, {
            player2SocketId: socket.id,
          });

          // Join the room for the session
          socket.join(sessionCode);

          // Get words
          const currentGame = session.games[session.currentRound - 1];
          const wordThisPlayerIsGuessing = currentGame.words.filter(
            (word: Word) => word.wordSetter === 1
          )[0];
          const wordThisPlayerSet = currentGame.words.filter(
            (word: Word) => word.wordSetter === 2
          )[0];

          // Emit local round state if words have been set
          if (wordThisPlayerIsGuessing) {
            socket.emit(
              'rejoinSetWordThisPlayerIsGuessingLocalRoundState',
              wordThisPlayerIsGuessing.guesses,
              wordThisPlayerIsGuessing.results
            );
          }
          if (wordThisPlayerSet) {
            socket.emit(
              'rejoinSetWordThisPlayerSetLocalRoundState',
              wordThisPlayerSet.word
            );
          }
          // Emit the session, player 2 status, and rejoin event
          socket.emit('setSession', session);
          socket.emit('setPlayerIsHost', false);
          socket.emit('goToGameView');
          io.to(sessionCode).emit('opponentRejoined');

          logAction('Player 2 successfully rejoined session ' + sessionCode);
          callback();
        } else {
          throw new Error('UUID does not match either player');
        }
      }
    } catch (error: any) {
      logError(error.message);
      callback(error.message);
    }
  });

  // Exit session -> called when player exits a session from the lobby
  socket.on('exitSession', async ([playerNumber, sessionCode], callback) => {
    try {
      logEvent('User exited session ' + sessionCode);

      // Leave room
      socket.leave(sessionCode);

      let session = await sessionController.getSessionFromCode(sessionCode);

      // Delete the session if no other player is present
      if (!session.player2Connected) {
        sessionController.deleteSession(sessionCode);
        logAction('Deleted session ' + sessionCode);
        callback();
        return;
      }

      if (playerNumber === 1) {
        // Remove player 1 and promote player 2
        session = await sessionController.removePlayer1AndPromotePlayer2(
          sessionCode
        );
        io.to(sessionCode).emit('setSession', session);
        io.to(sessionCode).emit('setPlayerIsHost', true);
        logAction(
          'Removed player 1 and promoted player 2 in session ' + sessionCode
        );
      } else if (playerNumber === 2) {
        // Remove player 2 from the session
        session = await sessionController.removePlayer2(sessionCode);
        io.to(sessionCode).emit('setSession', session);
        logAction('Removed player 2 from session ' + sessionCode);
      }

      callback();
    } catch (error: any) {
      logError(error.message);
      callback(error.message);
    }
  });

  // Start game -> called when host starts the game from the lobby
  socket.on('startGame', async (sessionCode, callback) => {
    try {
      logEvent('Host started game ' + sessionCode);
      let session = await sessionController.getSessionFromCode(sessionCode);

      session = await sessionController.startGame(sessionCode);

      io.to(sessionCode).emit('setSession', session);
      io.to(sessionCode).emit('goToGameView');
      logAction('Started game ' + sessionCode);
      callback();
    } catch (error: any) {
      logError(error.message);
      callback(error.message);
    }
  });

  // Kick player 2 -> called when host kicks player 2 from the lobby
  socket.on('kickPlayer2', async (sessionCode, callback) => {
    try {
      logEvent('Host kicked player 2 from ' + sessionCode);
      let session = await sessionController.removePlayer2(sessionCode);
      io.to(sessionCode).emit('removePlayer2');
      logAction('Kicked player 2 from ' + sessionCode);
      callback();
    } catch (error: any) {
      logError(error.message);
      callback(error.message);
    }
  });

  // Leave room -> called when player exits the lobby
  socket.on('leaveRoom', (sessionCode, callback) => {
    socket.leave(sessionCode);
    callback();
  });

  // Update game option -> called when host updates a game option
  socket.on(
    'updateGameOption',
    async ([option, value, sessionCode], callback) => {
      try {
        let session = await sessionController.updateSession(sessionCode, {
          [option]: value,
        });
        io.to(sessionCode).emit('setSession', session);
        callback();
      } catch (error: any) {
        logError(error.message);
        callback(error.message);
      }
    }
  );

  /* Game events */
  // Set word -> called when player sets a word
  socket.on('setWord', async ([word, playerNumber, sessionCode], callback) => {
    try {
      let session = await sessionController.getSessionFromCode(sessionCode);
      const currentGame = session.games[session.currentRound - 1];

      // Set the word for the player
      if (playerNumber === 1) {
        currentGame.words.push({ wordSetter: 1, word });
      } else if (playerNumber === 2) {
        currentGame.words.push({ wordSetter: 2, word });
      }

      // If both players have set words, start the round
      if (currentGame.words.length === 2) {
        logAction(
          'Starting round ' + session.currentRound + ' in ' + sessionCode
        );
        currentGame.state = 'in play';
      }

      session = await sessionController.updateSession(sessionCode, {
        games: session.games,
      });

      io.to(sessionCode).emit('setSession', session);
      callback();
    } catch (error: any) {
      logError(error.message);
      callback(error.message);
    }
  });

  // Made guess -> called when player makes a guess
  socket.on(
    'madeGuess',
    async ([guess, results, playerNumber, sessionCode], callback) => {
      try {
        let session = await sessionController.getSessionFromCode(sessionCode);
        const currentGame = session.games[session.currentRound - 1];
        const currentWord = currentGame.words.find(
          (word: Word) => word.wordSetter !== playerNumber
        );

        if (!currentWord || !currentWord.guesses || !currentWord.results) {
          throw new Error("Player's word not found");
        }

        // Push the guess and results
        currentWord.guesses[currentWord.results.length] = guess;
        currentWord.results.push(results);

        // Conditions for completing the round
        if (currentWord.word === guess || currentWord.results.length === 6) {
          currentWord.guessingComplete = true;

          if (currentWord.word === guess) {
            currentWord.guessedIn = currentWord.results.length;
          } else currentWord.guessedIn = 7;

          if (currentGame.words.every((word: Word) => word.guessingComplete)) {
            currentGame.state = 'complete';
          }
        }

        session = await sessionController.updateSession(sessionCode, {
          games: session.games,
        });

        io.to(sessionCode).emit('setSession', session);

        callback();
      } catch (error: any) {
        logError(error.message);
        callback(error.message);
      }
    }
  );

  // Next round -> called when host moves to the next round
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
    } catch (error: any) {
      logError(error.message);
      callback(error.message);
    }
  });

  // End game -> called when host moves to game summary
  socket.on('endGame', async (sessionCode, callback) => {
    try {
      logEvent('Game ' + sessionCode + ' completed');

      let session = await sessionController.updateSession(sessionCode, {
        state: 'complete',
      });

      io.to(sessionCode).emit('resetLocalRoundState');
      io.to(sessionCode).emit('setSession', session);
      io.to(sessionCode).emit('goToSummaryView');

      callback();
    } catch (error: any) {
      logError(error.message);
      callback(error.message);
    }
  });

  // Disconnect event
  // Process disconnects from lobby, game, and empty sessions
  socket.on('disconnect', async () => {
    try {
      logEvent('User disconnected');
      const sessions = await sessionController.getSessionsFromSocketId(
        socket.id
      );
      if (sessions.length === 0) {
        logInfo('User was connected to no sessions');
        return;
      }
      logInfo(
        'User sessions: ' +
          Array.from(
            sessions,
            (session: { sessionCode: string }) => session.sessionCode
          )
      );

      sessions.forEach(async (session: Session) => {
        const room = io.sockets.adapter.rooms.get(session.sessionCode);
        const numberOfClients = room ? room.size : 0;
        logInfo(
          'Number of clients in ' + session.sessionCode + ': ' + numberOfClients
        );

        // Delete empty sessions
        if (numberOfClients === 0) {
          sessionController.deleteSession(session.sessionCode);
          logAction('Deleted empty session ' + session.sessionCode);
          return;
        } else if (numberOfClients > 1) {
          throw new Error('Session has more than one client');
        }

        if (session.state === 'in lobby') {
          if (session.player2SocketId === socket.id) {
            // Remove player 2 from the session
            session = await sessionController.removePlayer2(
              session.sessionCode
            );
            io.to(session.sessionCode).emit('setSession', session);
            logAction('Removed player 2 from session ' + session.sessionCode);
          } else {
            // Otherwise remove player 1 and promote player 2
            session = await sessionController.removePlayer1AndPromotePlayer2(
              session.sessionCode
            );
            io.to(session.sessionCode).emit('setSession', session);
            io.to(session.sessionCode).emit('setPlayerIsHost', true);
            logAction(
              'Removed player 1 and promoted player 2 in session ' +
                session.sessionCode
            );
          }
        } else if (session.state === 'in play') {
          // Emit opponent left event if the session is in play
          io.to(session.sessionCode).emit('opponentLeftMidGame');
          logAction(
            'Session ' +
              session.sessionCode +
              ' is in play with a remaining player. Emitted opponent left event...'
          );
        }
      });
    } catch (error: any) {
      logError(error.message);
      // No callback for disconnect events
    }
  });
};
