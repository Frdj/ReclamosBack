 /**
 * Configurations of logger.
 */
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const consoleConfig = [
  new transports.Console({
    'colorize': true
  })
];

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

/*const createLogger = new createLogger({
  'transports': consoleConfig
});*/

const successLogger = createLogger({
    format: combine(
      timestamp(),
      myFormat
    ),
    transports: [
      new transports.File({ 
          filename: 'server/logs/success.log', 
          level: 'info'
      }),
      new transports.Console(),
      new transports.File({ filename: 'server/logs/debug.log', level: 'debug'  })
    ]
  });

const errorLogger = createLogger({
    format: combine(
      timestamp(),
      myFormat
    ),
    transports: [
      new transports.File({ 
          filename: 'server/logs/exceptions.log', 
          level: 'error'
      }),
      new transports.Console(),
      new transports.File({ filename: 'server/logs/debug.log',level: 'debug' })
    ]
  });

const errorIntegrations = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ 
        filename: 'server/logs/integrations_errors.log', 
        level: 'error'
    }),
  ]
});

module.exports = {
  'successlog': successLogger,
  'errorlog': errorLogger,
  'integrationslog': errorIntegrations
};