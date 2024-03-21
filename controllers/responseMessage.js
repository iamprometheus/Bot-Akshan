import { ChampionsModel } from '../models/champions.js'
import { caesarCipher } from '../utils.js'
import { updateDatabase } from '../mongo.js'
import { EmbedBuilder } from 'discord.js'

export const gamesHandler = async function ({
  commandName,
  commandMessage,
  userMessage
}) {
  try {
    switch (commandName) {
      case 'habilidadv1':
        return abilityV1Handler(commandMessage, userMessage)
      case 'campeon':
        return champHandler(commandMessage, userMessage)
      case 'habilidadv2':
        return abilityV2Handler(commandMessage, userMessage)
      case 'frase':
        return quoteHandler(commandMessage, userMessage)
      case 'quienes':
        return whoIsHandler(commandMessage, userMessage)
      case 'emojis':
        return emojisHandler(commandMessage, userMessage)
      default:
        return console.log('????')
    }
  } catch (error) {
    console.log('Command error', command, error)
  }
}

const abilityV1Handler = async function (abilityMessage, userMessage) {
  const correctAnswer = {
    champ: '',
    ability: ''
  }

  let encriptedInfo = await getCorrectAnswer(
    abilityMessage,
    'habilidadv1'
  ).catch(e =>
    userMessage.channel
      .send('Espera que cargue la habilidad, ¡velocista!')
      .catch(error => handleErrors(userMessage, error))
  )

  correctAnswer.champ = encriptedInfo.slice(0, -1)
  correctAnswer.ability = encriptedInfo.slice(-1)

  if (!correctAnswer.ability || !correctAnswer.champ) return

  const userAnswer = strCleaner(userMessage.content)
  if (!correctAnswer.champ.includes(userAnswer)) {
    return onWrongAnswer(abilityMessage.commandName, userMessage)
  }
  return onCorrectAnswer(abilityMessage, userMessage)
}

const abilityV2Handler = async function (abilityMessage, userMessage) {
  const correctAnswer = await getCorrectAnswer(
    abilityMessage,
    'habilidadv2'
  ).catch(e =>
    userMessage.channel
      .send('Espera que cargue la habilidad, ¡velocista!')
      .catch(error => handleErrors(userMessage, error))
  )

  if (!correctAnswer) return

  const userAnswer = strCleaner(userMessage.content)

  if (!correctAnswer.includes(userAnswer)) {
    return onWrongAnswer(abilityMessage.commandName, userMessage)
  }

  return onCorrectAnswer(abilityMessage, userMessage)
}

const quoteHandler = async function (quoteMessage, userMessage) {
  let correctAnswer = await getCorrectAnswer(quoteMessage, 'frase').catch(e =>
    userMessage.channel
      .send('Espera que cargue la frase, ¡velocista!')
      .catch(error => handleErrors(userMessage, error))
  )

  if (!correctAnswer) return
  const userAnswer = strCleaner(userMessage.content)

  if (!correctAnswer.includes(userAnswer)) {
    return onWrongAnswer(quoteMessage.commandName, userMessage)
  }

  return onCorrectAnswer(quoteMessage, userMessage)
}

const whoIsHandler = async function (whoIsMessage, userMessage) {
  let correctAnswer = await getCorrectAnswer(whoIsMessage, 'quienes').catch(e =>
    userMessage.channel
      .send('Espera que cargue el apodo, ¡velocista!')
      .catch(error => handleErrors(userMessage, error))
  )

  if (!correctAnswer) return
  const userAnswer = strCleaner(userMessage.content)

  if (!correctAnswer.includes(userAnswer))
    return onWrongAnswer(whoIsMessage.commandName, userMessage)

  return onCorrectAnswer(whoIsMessage, userMessage)
}

const champHandler = async function (champMessage, userMessage) {
  let correctChamp = await getCorrectAnswer(champMessage, 'campeon').catch(e =>
    userMessage.channel
      .send('Espera que cargue el campeón, ¡velocista!')
      .catch(error => handleErrors(userMessage, error))
  )
  if (!correctChamp) return

  const userChamp = strCleaner(userMessage.content)
  const correctAnswer = await ChampionsModel.getAttributes({
    champ: correctChamp
  })
  const answer = await ChampionsModel.getAttributes({ champ: userChamp })

  if (!answer) return userMessage.react('❓').catch(e => console.error(e))

  //Comparar respuestas
  let comparativa
  try {
    comparativa = compareAnswers(answer, correctAnswer)
  } catch (error) {
    console.log(
      'Error Comparing Champs',
      answer,
      correctChamp,
      correctAnswer,
      champMessage,
      userMessage,
      error
    )
    return
  }

  let champEmbed = buildChampEmbed(answer, comparativa)

  userMessage.channel
    .send({ embeds: [champEmbed] })
    .catch(error => handleErrors(userMessage, error))

  for (const value of Object.values(comparativa)) {
    if (value == false || value == 'partial') return
  }

  updateDatabase(champMessage, userMessage).catch(error => console.error(error))

  return userMessage
    .reply(`¡Lo lograste! La respuesta era ${answer.Nombre}`)
    .catch(error => handleErrors(userMessage, error))
}

const buildChampEmbed = function (answer, comparative) {
  const champEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(answer.Nombre)
    .setDescription(
      `Genero: ${comparative.Gender ? '🟢' : '🔴'} ${answer.Gender}\n
        Linea: ${selectColor(comparative.Positions)} ${answer.Positions}\n
   Especie: ${selectColor(comparative.Species)} ${answer.Species}\n
  Recurso: ${comparative.Resource ? '🟢' : '🔴'} ${answer.Resource}\n
   Alcance: ${selectColor(comparative.RangeType)} ${answer.RangeType}\n
     Region: ${selectColor(comparative.Region)} ${answer.Region}\n
          Año: ${comparative.ReleaseYear ? '🟢' : '🔴'} ${answer.ReleaseYear}
  `
    )
    .setThumbnail(answer.IconUrl)

  return champEmbed
}

const selectColor = function (element) {
  if (element === true) return '🟢'
  if (element === 'partial') return '🟡'
  return '🔴'
}

export const arraysShareItem = function (answer, correctAnswer) {
  // Ambas variables no son array
  if (!Array.isArray(answer) && !Array.isArray(correctAnswer))
    return answer === correctAnswer

  // Ambas variables son array
  if (Array.isArray(answer) && Array.isArray(correctAnswer)) {
    if (answer.every(element => correctAnswer.includes(element))) return true
    if (correctAnswer.some(element => answer.includes(element)))
      return 'partial'
    return false
  }
  // La primera variable no es array
  if (!Array.isArray(answer) && Array.isArray(correctAnswer)) {
    if (correctAnswer.includes(answer)) return 'partial'
    return false
  }
  // La segunda variable no es array
  if (Array.isArray(answer) && !Array.isArray(correctAnswer)) {
    if (answer.includes(correctAnswer)) return 'partial'
  }
  return false
}

const compareAnswers = function (answer, correctAnswer) {
  let correct = {}
  correct.Gender = answer.Gender === correctAnswer.Gender ? true : false
  correct.Positions = arraysShareItem(answer.Positions, correctAnswer.Positions)
  correct.Species = arraysShareItem(answer.Species, correctAnswer.Species)
  correct.Resource = answer.Resource === correctAnswer.Resource ? true : false
  correct.RangeType = arraysShareItem(answer.RangeType, correctAnswer.RangeType)
  correct.Region = arraysShareItem(answer.Region, correctAnswer.Region)
  correct.ReleaseYear =
    answer.ReleaseYear === correctAnswer.ReleaseYear ? true : false

  return correct
}

const emojisHandler = async function (emojisMessage, userMessage) {
  let messages = await userMessage.channel.messages.fetch({
    limit: 10,
    cache: true
  })

  let correctAnswer = await getCorrectAnswer(emojisMessage, 'emojis').catch(e =>
    userMessage.channel
      .send('Espera que carguen los emojis, ¡velocista!')
      .catch(error => handleErrors(userMessage, error))
  )

  let actualEmojis = messages.filter(m =>
    m.content.startsWith(':white_small_square:')
  )

  const userAnswer = strCleaner(userMessage.content)
  const emojis = await ChampionsModel.getEmojis({ champ: correctAnswer })

  if (!correctAnswer.includes(userAnswer)) {
    try {
      actualEmojis.forEach(m => {
        m.edit(showNextEmoji(actualEmojis, emojis))
      })
      return userMessage.react('❌')
    } catch (error) {
      return console.log(`Error reacting in emojis response`, error)
    }
  }

  showAllEmojis(actualEmojis, emojis)
  return onCorrectAnswer(emojisMessage, userMessage)
}

const showNextEmoji = function (actualEmojis, correctEmojis) {
  const nextEmojis = []
  let champEmojis = correctEmojis
  let prevEmojis
  actualEmojis.forEach(message => (prevEmojis = message.content))
  let emojiRegex = /(:.*?:)/g // Matches every emoji name.
  prevEmojis = prevEmojis.split(emojiRegex).filter(value => value != '')
  prevEmojis.forEach(emoji =>
    emoji != ':grey_question:' ? nextEmojis.push(emoji) : 1
  )

  let length = prevEmojis.length
  let tempNextEmojis = nextEmojis.slice(1)

  if (tempNextEmojis.length === champEmojis.length) return

  champEmojis = champEmojis.filter(value => {
    const index = tempNextEmojis.indexOf(value)
    if (index != -1) {
      if (index == 0) {
        tempNextEmojis = tempNextEmojis.slice(1)
        return false
      }
      if (index == tempNextEmojis.length - 1) {
        tempNextEmojis = tempNextEmojis.slice(0, -1)
        return false
      }
      tempNextEmojis = tempNextEmojis
        .slice(0, index)
        .concat(tempNextEmojis.slice(index + 1))
      return false
    }
    return true
  })

  champEmojis = champEmojis
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

  nextEmojis.push(champEmojis.pop())

  for (let i = nextEmojis.length - 1; i < length - 1; i++) {
    nextEmojis.push(':grey_question:')
  }

  return nextEmojis.join('')
}

const showAllEmojis = function (actualEmojis, correctEmojis) {
  actualEmojis.forEach(m => {
    m.edit(`:white_small_square:${correctEmojis.join('')}`)
  })
}

export const strCleaner = function (str) {
  return str
    .toLowerCase()
    .replaceAll(`'`, '')
    .replaceAll(' ', '')
    .replaceAll('.', '')
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
