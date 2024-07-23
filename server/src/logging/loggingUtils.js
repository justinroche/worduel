const EVENT_PREFIX = '[EVENT]';
const INFO_PREFIX = '[INFO]';
const ACTION_PREFIX = '[ACTION]';
const ERROR_PREFIX = '[ERROR]';

exports.logEvent = (message) => {
  console.log(EVENT_PREFIX, message);
};

exports.logInfo = (message) => {
  console.log(INFO_PREFIX, message);
};

exports.logAction = (message) => {
  console.log(ACTION_PREFIX, message);
};

exports.logError = (message) => {
  console.log(ERROR_PREFIX, message);
};
