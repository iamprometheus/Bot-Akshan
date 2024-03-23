import { caesarCipher } from '#utils'
import { updateDatabase } from '#mongo'
import { champHandler } from './handlers/champ.js'
import { quoteWhoAbilityHandler } from './handlers/quoteWhoAbilityV2.js'
import { abilityV1Handler } from './handlers/abilityV1.js'
import { emojisHandler } from './handlers/emojis.js'

export const gamesHandler = async function ({
  commandName,
  commandMessage,
  userMessage
}) {
  let correctChamp = await getCorrectAnswer(commandMessage, commandName).catch(
    e =>
      userMessage.channel
        .send('Espera que cargue la habilidad, ¡velocista!')
        .catch(error => handleErrors(userMessage, error))
  )

  const params = {
    commandMessage,
    userMessage,
    correctChamp,
    onCorrectAnswer,
    onWrongAnswer
  }

  try {
    switch (commandName) {
      case 'habilidadv1':
        return abilityV1Handler(params)
      case 'campeon':
        return champHandler(params)
      case 'habilidadv2':
        return quoteWhoAbilityHandler(params)
      case 'frase':
        return quoteWhoAbilityHandler(params)
      case 'quienes':
        return quoteWhoAbilityHandler(params)
      case 'emojis':
        return emojisHandler(params)
      default:
        return console.log('????')
    }
  } catch (error) {
    console.log('Command error', command, error)
  }
}

export const getCorrectAnswer = async function (commandMsg, command) {
  if (command != 'habilidadv1')
    return caesarCipher(
      commandMsg.embeds[0].data.author.icon_url.split('/')[5].split('.p')[0]
    )

  return caesarCipher(
    commandMsg.embeds[0].data.image.url.split('/')[5].split('.p')[0]
  )
}

const onCorrectAnswer = async function (commandMsg, userMsg) {
  await updateDatabase(commandMsg, userMsg).catch(error => console.log(error))

  userMsg.react('✅').catch(error => handleErrors(userMsg, error))
  return userMsg
    .reply(`¡Correcto!`)
    .catch(error => handleErrors(userMsg, error))
}

const onWrongAnswer = function (command, userMsg) {
  try {
    return userMsg.react('❌')
  } catch (error) {
    console.log(`Error reacting in ${command} response`, error)
    return
  }
}
