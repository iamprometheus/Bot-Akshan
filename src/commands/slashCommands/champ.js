import { SlashCommandBuilder } from 'discord.js'
import { ChampionsModel } from '#localChampionModel'
import { getNextChamp, handleErrors } from '#utils'
import { authorTextEmbed } from '#embeds'

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

  const champEmbed = authorTextEmbed(
    'Escribe el nombre de un campeón para empezar.',
    result.encrypted_champ_icon_url,
    null,
    0xffffff
  )

  return interaction.editReply({ embeds: [champEmbed] }).catch(error => {
    console.log(`Couldn't reply champ embed`, error)
    handleErrors(interaction, error)
    interaction.channel
      .send({ embeds: [champEmbed] })
      .catch(error2 => handleErrors(interaction, error2))
  })
}
