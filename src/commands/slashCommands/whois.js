import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ChampionsModel } from '#localChampionModel'
import { getNextChamp } from '#utils'
import { authorTextEmbed } from '#embeds'

export const data = new SlashCommandBuilder()
  .setName('quienes')
  .setDescription('Adivina el campeón de acuerdo a su apodo.')
export async function execute (interaction) {
  if (interaction.channel.name !== 'bot-akshan')
    return interaction.editReply(
      'Ve al canal bot-akshan para jugar, si no existe crea uno con /canal.'
    )

  const champ = getNextChamp()
  const result = await ChampionsModel.getAka({ champ })
  const url = result[0]
  const nickName = result[1]

  const whoIsEmbed = authorTextEmbed(
    '¿Quién es...',
    url,
    `> ${nickName}.`,
    0xffffff
  )

  try {
    return await interaction.editReply({ embeds: [whoIsEmbed] })
  } catch (error) {
    console.log(`Couldn't reply whoIs embed`, error)
    return await interaction.channel.send({ embeds: [whoIsEmbed] })
  }
}
