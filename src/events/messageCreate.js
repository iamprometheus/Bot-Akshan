import { Events } from 'discord.js'
import { handleErrors } from '#utils'
import { gamesHandler } from '#controllers/responseMessage.js'
import { normalizeName, ChampionsModel } from '#localChampionModel'
import { JoinAndPlay } from '#commands/dotCommands/joinVoiceChannel.js'

import 'dotenv/config'
const PREFIX = '.play '

const champs = await ChampionsModel.getAllChamps()
const clientId = process.env.CLIENT_ID

const commands = [
  'habilidadv1',
  'habilidadv2',
  'campeon',
  'frase',
  'quienes',
  'emojis'
]

const isGameOver = function (messages) {
  return (
    messages.find(
      m =>
        m.interaction === null &&
        m.author.id === clientId &&
        !m.embeds[0]?.data.title &&
        !m.content.startsWith('Espera') &&
        !m.content.startsWith(':white_small_square:')
    ) || false
  )
}

export async function getCommand (interaction) {
  const messages = await interaction.channel.messages.fetch()

  const gameOver = isGameOver(messages)
  if (gameOver) return

  const commandMessage = messages.find(m =>
    commands.includes(m.interaction?.commandName)
  )

  return [commandMessage?.interaction?.commandName, commandMessage]
}

export const name = Events.MessageCreate
export async function execute (interaction) {
  if (interaction.guild.members.me.isCommunicationDisabled()) {
    interaction
      .reply('Lo siento, estoy aislado por ahora.')
      .catch(error => handleErrors(interaction, error))
    return
  }

  if (interaction.content.startsWith(PREFIX)) {
    const args = interaction.content.substring(PREFIX.length).split(' ')
    const channel = interaction.member.voice.channel
    JoinAndPlay(
      channel.id,
      channel.guild.id,
      channel.guild.voiceAdapterCreator,
      args
    )
  }

  if (!/[a-z'.]/i.test(interaction.content)) return
  if (interaction.author.bot || interaction.channel.name !== 'bot-akshan')
    return

  const command = await getCommand(interaction)
  if (!(command ?? false)) return

  if (!champs.includes(normalizeName(interaction.content)))
    return interaction.react('❓')

  return await gamesHandler({
    commandName: command[0],
    commandMessage: command[1],
    userMessage: interaction
  })
}
