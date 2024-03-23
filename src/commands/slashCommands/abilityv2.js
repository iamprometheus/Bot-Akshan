import { SlashCommandBuilder } from 'discord.js'
import { ChampionsModel } from '#localChampionModel'
import { getRandomItem, getNextChamp, handleErrors } from '#utils'
import { authorTextEmbed } from '#embeds'

export const data = new SlashCommandBuilder()
  .setName('habilidadv2')
  .setDescription(
    'Adivina de qué campeón es la habilidad de acuerdo a su nombre (difícil)'
  )
export async function execute (interaction) {
  if (interaction.channel.name !== 'bot-akshan')
    return interaction.editReply(
      'Ve al canal bot-akshan para jugar, si no existe crea uno con /canal.'
    )

  const champ = getNextChamp()
  const result = await ChampionsModel.getAbilities({ champ })
  const abilities = result[1]
  const url = result[0]

  const abilityEmbed = authorTextEmbed(
    '¿A qué campeón pertenece la siguiente habilidad?',
    url,
    `> ${getRandomItem(abilities)}.`,
    null
  )
  interaction.editReply({ embeds: [abilityEmbed] }).catch(error => {
    console.log(`Couldn't edit reply abilityV2 embed`, error)
    interaction.channel
      .send({ embeds: [abilityEmbed] })
      .catch(error2 => handleErrors(interaction, error2))
  })
}

/*
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠛⠛⠛⠿⣿⣿⣿⣿ 
⣿⣿⣿⣿⣿⣿⡿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀ ⠉⠻⣿⣿ 
⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀ ⠀  ⠀⠀⠀⠘⢿ 
⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀ ⠀⠀⠀ ⠀⠀⠀⠀⠀⣾ 
⣿⣿⠋⠈⠀⠀⠀⠀⠐⠺⣖⢄⠀⠀ ⠀⠀ ⠀⠀⠀⠀⣿ 
⣿⡏⢀⡆⠀⠀⠀⢋⣭⣽⡚⢮⣲⠆⠀⠀⠀ ⠀⠀⠀⢹ 
⣿⡇⡼⠀⠀⠀⠀⠈⠻⣅⣨⠇⠈⠀⠰⣀⣀⣀⡀⠀⢸ 
⣿⡇⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣟⢷⣶⠶⣃⢀⣿ 
⣿⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⠀⠈⠓⠚⢸⣿ 
⣿⡇⠀⠀⠀⠀⢀⡠⠀⡄⣀⠀⠀⠀⢻⠀⠀⠀⣠⣿⣿ 
⣿⡇⠀⠀⠀⠐⠉⠀⠀⠙⠉⠀⠠⡶⣸⠁⠀⣠⣿⣿⣿ 
⣿⣿⣦⡆⠀⠐⠒⠢⢤⣀⡰⠁⠇⠈⠘⢶⣿⣿⣿⣿⣿ 
⣿⣿⣿⡇⠀⠀⠀⠀⠠⣄⣉⣙⡉⠓⢀⣾⣿⣿⣿⣿⣿ 
⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿ 
⣿⣿⣿⣿⣿⣷⣤⣀⣀⠀⣀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿
*/
