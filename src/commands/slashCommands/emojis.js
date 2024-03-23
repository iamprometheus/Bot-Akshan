import { SlashCommandBuilder } from 'discord.js'
import { ChampionsModel } from '#localChampionModel'
import { getNextChamp, getRandomItem, handleErrors } from '#utils'
import { authorTextEmbed } from '#embeds'

export const data = new SlashCommandBuilder()
  .setName('emojis')
  .setDescription('Adivina el campeón de acuerdo a los siguientes emojis')
export async function execute (interaction) {
  if (interaction.channel.name !== 'bot-akshan')
    return interaction
      .editReply(
        'Ve al canal bot-akshan para jugar, si no existe crea uno con /canal.'
      )
      .catch(error => handleErrors(interaction, error))

  let champ = getNextChamp()
  let emojis = await ChampionsModel.getEmojis({ champ })

  while (emojis[1] == '') {
    champ = getNextChamp()
    emojis = await ChampionsModel.getEmojis({ champ })
  }

  const url = emojis[0]
  const starterEmoji = getRandomItem(emojis[1])

  const emojisEmbed = authorTextEmbed(
    '¿Qué campeón describen los siguientes emojis?',
    url,
    null,
    0xffffff
  )

  interaction
    .editReply({ embeds: [emojisEmbed] })
    .then(
      setTimeout(
        () =>
          interaction.followUp(
            `:white_small_square:${starterEmoji}${':grey_question:'.repeat(
              emojis[1].length - 1
            )}`
          ),
        200
      )
    )
    .catch(error => {
      console.log(`Couldn't reply emojis embed`, error)
      interaction.channel
        .send({ embeds: [emojisEmbed] })
        .catch(error => handleErrors(interaction, error))
    })
}
