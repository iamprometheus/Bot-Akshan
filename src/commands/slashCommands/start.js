import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js'
import { channelHeaderEmbed } from '#embeds'

export const data = new SlashCommandBuilder()
  .setName('iniciar')
  .setDescription('Genera el menu cabezera del canal del bot')
export async function execute (interaction) {
  if (interaction.channel.name !== 'bot-akshan')
    return interaction.editReply(
      'Debes estar en el canal bot-akshan para usar este comando.'
    )

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('comojugar')
      .setLabel('Como Jugar')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('stats')
      .setLabel('Estadísticas')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('info')
      .setLabel('Información')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('hint')
      .setLabel('Pista')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setLabel('Donaciones')
      .setStyle(ButtonStyle.Link)
      .setURL('https://www.paypal.com/paypalme/KanielOutis99')
  )

  const channelHeader = channelHeaderEmbed()

  try {
    return interaction.editReply({
      embeds: [channelHeader],
      components: [buttons]
    })
  } catch (error) {
    console.log(`Couldn't edit reply start embed`, error)
    return interaction.channel.send({
      embeds: [channelHeader],
      components: [buttons]
    })
  }
}
