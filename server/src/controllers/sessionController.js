const Session = require('../models/sessionModel');

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
  const session = await Session.findOne({ sessionCode });
  if (!session) {
    throw new Error('Session not found');
  }

  return session;
};

exports.updateSession = async (sessionCode, update) => {
  try {
    const session = await this.getSessionFromCode(sessionCode);
    session.set(update);
    await session.save();
    return session;
  } catch (error) {
    console.error('Error updating session:', error);
  }
};

exports.closeSession = async (sessionCode) => {
  this.updateSession(sessionCode, { state: 'complete' });
};
