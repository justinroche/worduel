const EVENT_PREFIX = '[EVENT]';
const INFO_PREFIX = '[INFO]';
const ACTION_PREFIX = '[ACTION]';
const ERROR_PREFIX = '[ERROR]';

export const logEvent = (message: string) => {
  console.log(EVENT_PREFIX, message);
};

export const logInfo = (message: string) => {
  console.log(INFO_PREFIX, message);
};

export const logAction = (message: string) => {
  console.log(ACTION_PREFIX, message);
};

export const logError = (message: string) => {
  console.log(ERROR_PREFIX, message);
};
