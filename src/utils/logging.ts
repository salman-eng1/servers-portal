import winston, { format } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

// Define a custom format with timestamp
const customFormat = printf(({ level, message, timestamp, ...rest }) => {
  return `${timestamp} ${level}: ${message} ${JSON.stringify(rest)}`;
});

// Define daily rotate file transport for info level logs
const infoRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'info',
  dirname: './logs',
  maxSize: '20m',
  maxFiles: '2d', // Keep logs for 14 days
});

// Define daily rotate file transport for error level logs
const errorRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: 'errors-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  dirname: './logs',
  maxSize: '20m',
  maxFiles: '2d', // Keep logs for 14 days
});

export const logger = winston.createLogger({
  format: combine(
    timestamp(),
    customFormat,
    winston.format.colorize({level: true})
  ),
  transports: [
    infoRotateFileTransport,
    errorRotateFileTransport
  ]
});

// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      timestamp(),
      customFormat,
    ),
  }));
}
