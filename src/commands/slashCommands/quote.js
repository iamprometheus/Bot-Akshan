import { SlashCommandBuilder } from 'discord.js'
import { ChampionsModel } from '#localChampionModel'
import { getRandomItem, getNextChamp } from '#utils'
import { authorTextEmbed } from '#embeds'

export const data = new SlashCommandBuilder()
  .setName('frase')
  .setDescription('¿Quién dijo la siguiente frase?')
export async function execute (interaction) {
  if (interaction.channel.name !== 'bot-akshan')
    return interaction.editReply(
      'Ve al canal bot-akshan para jugar, si no existe crea uno con /canal.'
    )

  const champ = getNextChamp()
  const quotes = await ChampionsModel.getQuotes({ champ })
  const url = quotes[0]

  const quoteEmbed = authorTextEmbed(
    '¿Qué campeón dijo lo siguiente?',
    url,
    getRandomItem(quotes[1]),
    0xffffff
  )

  try {
    return await interaction.editReply({ embeds: [quoteEmbed] })
  } catch (error) {
    console.log(`Couldn't edit reply quote embed`, error)
    return await interaction.channel.send({ embeds: [quoteEmbed] })
  }
}
