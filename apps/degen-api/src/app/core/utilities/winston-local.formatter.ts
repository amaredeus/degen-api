import * as winston from 'winston';
import * as util from 'util';
import * as colorette from 'colorette';

/** Log formatter for local dev with pretty printing and colors */
export const LocalWinstonFormatter = () =>
  winston.format.printf((info) => {
    let msgColor;
    switch (info.level) {
      case 'debug':
        msgColor = 'gray';
        break;
      case 'info':
        msgColor = 'green';
        break;
      case 'warn':
        msgColor = 'yellow';
        break;
      default:
        msgColor = 'red';
        break;
    }
    // Format output
    const { level, message, timestamp, context, stack, ...data } = info;
    const levelFormatted = `[${info.level.toUpperCase()}]`;
    const timestampFormatted = new Date(info.timestamp).toLocaleTimeString();
    const contextFormatted =
      typeof info.context === 'object'
        ? info.context['context'] ?? 'Unknown'
        : info.context;
    const stackFormatted = stack ? `:\n${colorette.red(stack)}` : '';
    // Extract extra data props
    const dataProps = {};
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        dataProps[key] = data[key];
      }
    });
    const dataFormatted =
      dataProps && Object.keys(dataProps).length !== 0
        ? `:\n ${util.inspect(dataProps, false, 5, true)}`
        : '';
    return `${colorette.bold(
      colorette[msgColor](levelFormatted)
    )} ${timestampFormatted} ${colorette.cyan(
      '[' + contextFormatted + ']'
    )} ${colorette[msgColor](message)}${stackFormatted}${dataFormatted}`;
  });
