import log from 'loglevel';
type LogLevelNames = 'trace' | 'debug' | 'info' | 'warn' | 'error';

// Configure log level based on environment
const logLevel: LogLevelNames = import.meta.env.LOG_LEVEL || 'info';
log.setLevel(logLevel);

// Export the logger
export const logger = log;
