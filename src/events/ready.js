import logger from '../config/logger.js';

const NAMESPACE = 'Event';

export default {
  name: 'ready',
  once: true,
  execute(client) {
    logger.info(NAMESPACE, `A bot készen áll. (${client.user.tag})`);
  },
};
