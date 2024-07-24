import SessionModel, { Session } from '../models/sessionModel.js';

const generateSessionCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const createSession = async (): Promise<Session> => {
  let sessionCode;
  let sessionExists = true;

  while (sessionExists) {
    sessionCode = generateSessionCode();
    const existingSession = await SessionModel.findOne({ sessionCode });
    if (!existingSession) {
      sessionExists = false;
    }
  }

  const newSession = new SessionModel({ sessionCode });
  await newSession.save();

  if (!newSession) {
    throw new Error('Error creating session');
  }

  return newSession;
};

export const getSessionFromCode = async (
  sessionCode: string
): Promise<Session> => {
  const session = await SessionModel.findOne({ sessionCode });
  if (!session) {
    throw new Error('Session not found');
  }
  return session;
};

export const getSessionsFromSocketId = async (
  socketId: string
): Promise<Session[]> => {
  const sessions = await SessionModel.find({
    $or: [{ player1SocketId: socketId }, { player2SocketId: socketId }],
  });
  if (!sessions) {
    throw new Error('Sessions not found');
  }
  return sessions;
};

export const updateSession = async (
  sessionCode: string,
  update: object
): Promise<Session> => {
  try {
    const session = await getSessionFromCode(sessionCode);
    session.set(update);
    await session.save();
    return session;
  } catch (error: any) {
    throw new Error('Error updating session: ' + error.message);
  }
};

export const deleteSession = async (sessionCode: string) => {
  try {
    await SessionModel.deleteOne({ sessionCode });
  } catch (error: any) {
    throw new Error('Error deleting session: ' + error.message);
  }
};

export const removePlayer2 = async (sessionCode: string): Promise<Session> => {
  try {
    return await updateSession(sessionCode, {
      player2Connected: false,
      player2Name: 'Player 2',
      player2UUID: '',
      player2SocketId: '',
    });
  } catch (error: any) {
    throw new Error('Error removing player 2: ' + error.message);
  }
};

export const removePlayer1AndPromotePlayer2 = async (
  sessionCode: string
): Promise<Session> => {
  try {
    const session = await getSessionFromCode(sessionCode);

    return await updateSession(sessionCode, {
      player2Connected: false,
      player1Name:
        session.player2Name === 'Player 2' ? 'Player 1' : session.player2Name,
      player1UUID: session.player2UUID,
      player1SocketId: session.player2SocketId,
      player2Name: 'Player 2',
      player2UUID: '',
      player2SocketId: '',
    });
  } catch (error: any) {
    throw new Error(
      'Error removing player 1 and promoting player 2: ' + error.message
    );
  }
};

export const startGame = async (sessionCode: string): Promise<Session> => {
  try {
    const session = await getSessionFromCode(sessionCode);

    // Create the initial game objects
    const games = Array.from({ length: session.rounds }, (_, index) => ({
      id: index,
      state: 'setting word',
      words: [],
    }));

    // Update the session
    return await updateSession(sessionCode, {
      state: 'in play',
      currentRound: 1,
      games: games,
    });
  } catch (error: any) {
    throw new Error('Error starting game: ' + error.message);
  }
};

export default {
  createSession,
  getSessionFromCode,
  getSessionsFromSocketId,
  updateSession,
  deleteSession,
  removePlayer2,
  removePlayer1AndPromotePlayer2,
  startGame,
};
