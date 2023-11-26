import logger from './logger';
import axios from 'axios';
import { getTelegramBotToken, getTelegramChatId, getPushoverAppToken, getPushoverUserKey } from './config';

/**
 * Send an alert via Telegram.
 */
const sendTelegramAlert = async (message: string): Promise<void> => {
  const botToken = getTelegramBotToken();
  const chatId = getTelegramChatId();

  if (!botToken || !chatId) {
    logger.warn('Telegram bot token or chat ID not configured.');
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    await axios.post(url, { chat_id: chatId, text: message });
    logger.info('Alert sent to Telegram.');
  } catch (error) {
    logger.error('Failed to send alert to Telegram:', error);
  }
};

/**
 * Send an alert via Pushover.
 */
const sendPushoverAlert = async (message: string): Promise<void> => {
  const appToken = getPushoverAppToken();
  const userKey = getPushoverUserKey();

  if (!appToken || !userKey) {
    logger.warn('Pushover app token or user key not configured.');
    return;
  }

  const url = 'https://api.pushover.net/1/messages.json';
  try {
    await axios.post(url, {
      token: appToken,
      user: userKey,
      message: message,
    });
    logger.info('Alert sent to Pushover.');
  } catch (error) {
    logger.error('Failed to send alert to Pushover:', error);
  }
};

/**
 * Public function to send alerts.
 */
export const sendAlert = async (message: string): Promise<void> => {
  // You can extend this logic to determine which service(s) to use.
  await sendTelegramAlert(message);
  await sendPushoverAlert(message);
};
