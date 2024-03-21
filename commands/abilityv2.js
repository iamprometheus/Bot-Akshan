import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ChampionsModel } from '../models/champions.js'
import { getRandomItem, getNextChamp, handleErrors } from '../utils.js'

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

  const abilityEmbed = new EmbedBuilder()
    .setAuthor({
      name: '¿A qué campeón pertenece la siguiente habilidad?',
      iconURL: url
    })
    .setTitle(`> ${getRandomItem(abilities)}.`) //||${champ.slice(0,1).toUpperCase()}||`)

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
