import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ChampionsModel } from '../models/champions.js'
import { getNextChamp, handleErrors } from '../utils.js'

export const data = new SlashCommandBuilder()
  .setName('campeon')
  .setDescription('Adivina el campeón de acuerdo a su información en el lore.')
export async function execute (interaction) {
  if (interaction.channel.name !== 'bot-akshan')
    return interaction
      .editReply(
        'Ve al canal bot-akshan para jugar, si no existe crea uno con /canal.'
      )
      .catch(error => {
        handleErrors(interaction, error)
      })

  const champ = getNextChamp()
  const result = await ChampionsModel.getChampByName({ champ })

  const champEmbed = new EmbedBuilder().setColor(0xffffff).setAuthor({
    name: 'Escribe el nombre de un campeón para empezar.',
    iconURL: result.encrypted_champ_icon_url
  })

  return interaction.editReply({ embeds: [champEmbed] }).catch(error => {
    console.log(`Couldn't reply champ embed`, error)
    handleErrors(interaction, error)
    interaction.channel
      .send({ embeds: [champEmbed] })
      .catch(error2 => handleErrors(interaction, error2))
  })
}
