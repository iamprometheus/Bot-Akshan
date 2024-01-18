import { SlashCommandBuilder, PermissionsBitField, ChannelType } from 'discord.js';

const createChannel = async function (interaction) {
  await interaction.guild.channels.create({
    name: 'bot-akshan',
    type: ChannelType.GuildText,
    parent: interaction.channel.parentId,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
    ],
  });
  return await interaction.editReply('Canal Creado!');
};

const resetChannel = async function (interaction) {
  await interaction.guild.channels.create({
    name: 'bot-akshan',
    type: ChannelType.GuildText,
    parent: interaction.channel.parentId,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
    ],
  });

  return interaction.channel.delete();
};

export const data = new SlashCommandBuilder()
  .setName('canal')
  .setDescription('Crea un nuevo canal para empezar a jugar.');
export async function execute(interaction) {
  const botPermissions = interaction.guild.members.me.permissions.serialize();
  if (!botPermissions.ManageChannels)
    return interaction.editReply(
      'Lo siento, no tengo permisos para crear canales.'
    );

  let channelExists = false;

  for (channel of interaction.guild.channels.cache.values()) {
    if (channel.type === 0 && channel.name === 'bot-akshan') {
      channelExists = true;
      break;
    }
  }

  if (!channelExists) {
    return createChannel(interaction).catch((error) => {
      interaction.channel.send('Canal Creado!');
      console.log(`Couldn't edit reply channel create`, error);
    });
  }

  if (interaction.channel.name === 'bot-akshan') {
    return resetChannel(interaction).catch((error) => {
      interaction.channel.send('Canal Creado!');
      console.log(`Couldn't edit reply channel create`, error);
    });
  }

  return await interaction.editReply('Ya existe un canal para Bot Akshan!');
}
