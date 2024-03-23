import { Events, Collection } from 'discord.js'
import { handleErrors } from '#utils'

const filterMessages = function (interaction, messages) {
  messages = messages.filter(m => m.interaction?.id !== interaction.id)
  const mainMessage = messages.find(
    m =>
      m.interaction?.commandName === 'iniciar' &&
      m.components[0]?.components.length > 0
  )
  ;[...messages] = messages

  if (mainMessage) {
    let isLastVersion = false
    for (const button of mainMessage.components[0].components) {
      if (button.data.custom_id == 'hint') isLastVersion = true
    }

    if (
      (interaction.commandName !== 'iniciar' &&
        mainMessage.components[0]?.components?.length < 5) ||
      !isLastVersion
    )
      interaction.channel
        .send(
          'Vuelve a usar el comando /iniciar para actualizar el mensaje principal del canal.'
        )
        .catch(error => handleErrors(interaction, error))
    if (interaction.commandName !== 'iniciar')
      messages.find((value, index) => {
        return value[1]?.interaction?.commandName === 'iniciar'
          ? messages.splice(index, 1)
          : false
      })
  } else {
    if (interaction.commandName !== 'iniciar')
      interaction.channel
        .send(
          'Usa el comando /iniciar para añadir un mensaje con información importante sobre el bot a este canal.'
        )
        .catch(error => handleErrors(interaction, error))
    messages.find((value, index) => {
      value[1]?.interaction?.commandName === 'iniciar'
        ? messages.splice(index, 1)
        : false
    })
  }

  return new Collection(messages)
}

const deleteMessages = async function (interaction, messages) {
  let delMsg
  try {
    delMsg = await interaction.channel.bulkDelete(
      filterMessages(interaction, messages)
    )
  } catch (error) {
    handleErrors(interaction, error)
    delMsg = false
  }
  return delMsg
}

export const name = Events.InteractionCreate
export async function execute (interaction) {
  if (interaction?.guild?.members?.me?.isCommunicationDisabled()) return
  const botPermissions = interaction.guild.members.me.permissions.serialize()

  if (!botPermissions.ManageMessages || !botPermissions.ReadMessageHistory)
    return interaction.reply(
      'Necesito los permisos para leer historial de mensajes y gestionar mensajes para funcionar correctamente.'
    )

  if (!interaction.isChatInputCommand()) return

  await interaction.deferReply()
  //interaction.channel.send("A partir de ahora el bot estará sin supervisión, si se deja de funcionar inesperadamente, es posible que no este disponible hasta luego de unas horas.")
  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }
  console.log(interaction.guild.name, interaction.commandName)

  if (
    interaction.commandName === 'canal' &&
    interaction.channel.name === 'bot-akshan'
  )
    return command.execute(interaction)

  if (interaction.channel.name === 'bot-akshan') {
    try {
      let messages = await interaction.channel.messages.fetch({
        limit: 100,
        cache: true
      })
      const deletedMessages = await deleteMessages(interaction, messages)
      if (deletedMessages === false)
        return interaction.editReply(
          'Escribe /canal para limpiar mensajes viejos de este canal.'
        )
      console.log(`Deleted ${deletedMessages.size} messages succesfully.`)
      return command.execute(interaction)
    } catch (error) {
      interaction
        .editReply('Problemas técnicos, intentalo de nuevo.')
        .catch(error => handleErrors(interaction, error))
      console.log(interaction, error)
      return
    }
  } else {
    try {
      command.execute(interaction)
    } catch (error) {
      console.log('Command Interaction error', interaction, error)
      return
    }
  }
}
