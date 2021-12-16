export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[✓] A bot készen áll. (${client.user.tag})`);
  },
};
