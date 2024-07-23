const Session = require('../models/sessionModel');
const { logError } = require('../logging/loggingUtils');

const generateSessionCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

exports.createSession = async () => {
  let sessionCode;
  let sessionExists = true;

  while (sessionExists) {
    sessionCode = generateSessionCode();
    const existingSession = await Session.findOne({ sessionCode });
    if (!existingSession) {
      sessionExists = false;
    }
  }

  const newSession = new Session({ sessionCode });
  await newSession.save();

  return newSession;
};

exports.getSessionFromCode = async (sessionCode) => {
  try {
    const session = await Session.findOne({ sessionCode });
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  } catch (error) {
    logError('Error getting session from code:', error.message);
  }
};

exports.getSessionsFromSocketId = async (socketId) => {
  try {
    const sessions = await Session.find({
      $or: [{ player1SocketId: socketId }, { player2SocketId: socketId }],
    });
    return sessions;
  } catch (error) {
    logError('Error getting sessions from socket ID:', error);
  }
};

exports.updateSession = async (sessionCode, update) => {
  try {
    const session = await this.getSessionFromCode(sessionCode);
    session.set(update);
    await session.save();
    return session;
  } catch (error) {
    logError('Error updating session:', error);
  }
};

exports.deleteSession = async (sessionCode) => {
  try {
    await Session.deleteOne({ sessionCode });
  } catch (error) {
    logError('Error deleting session:', error);
  }
};

exports.removePlayer2 = async (sessionCode) => {
  try {
    return await this.updateSession(sessionCode, {
      player2Connected: false,
      player2Name: 'Player 2',
      player2UUID: '',
      player2SocketId: '',
    });
  } catch (error) {
    logError('Error removing player 2:', error);
  }
};

exports.removePlayer1AndPromotePlayer2 = async (sessionCode) => {
  try {
    return await this.updateSession(session.sessionCode, {
      player2Connected: false,
      player1Name:
        session.player2Name === 'Player 2' ? 'Player 1' : session.player2Name,
      player1UUID: session.player2UUID,
      player1SocketId: session.player2SocketId,
      player2Name: 'Player 2',
      player2UUID: '',
      player2SocketId: '',
    });
  } catch (error) {
    logError('Error removing player 1 and promoting player 2:', error);
  }
};

exports.startGame = async (sessionCode) => {
  try {
    const session = await this.getSessionFromCode(sessionCode);

    // Create the initial game objects
    const games = Array.from({ length: session.rounds }, (_, index) => ({
      id: index,
      state: 'setting word',
      words: [],
    }));

    // Update the session
    return await this.updateSession(sessionCode, {
      state: 'in play',
      currentRound: 1,
      games: games,
    });
  } catch (error) {
    logError('Error starting game:', error.message);
  }
};
