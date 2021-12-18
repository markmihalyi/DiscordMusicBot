const dripCheck = (interaction) => {
  const username = interaction.member.user.username;
  const tag = interaction.member.user.discriminator;
  if (username == '𝗠𝗜𝗚𝗘𝗟' && tag == '2059') {
    return true;
  }
  return false;
};

export default dripCheck;
