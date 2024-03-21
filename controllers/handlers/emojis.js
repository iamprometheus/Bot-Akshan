import { strCleaner } from '../../utils.js'
import { ChampionsModel } from '../../models/champions.js'

export const emojisHandler = async function ({
  commandMessage,
  userMessage,
  correctChamp,
  onCorrectAnswer
}) {
  let messages = await userMessage.channel.messages.fetch({
    limit: 20,
    cache: true
  })

  let correctAnswer = correctChamp

  let actualEmojis = messages.filter(m =>
    m.content.startsWith(':white_small_square:')
  )

  const userAnswer = strCleaner(userMessage.content)
  const [url, emojis] = await ChampionsModel.getEmojis({ champ: correctAnswer })

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
  return onCorrectAnswer(commandMessage, userMessage)
}

const showNextEmoji = function (actualEmojis, champEmojis) {
  let prevEmojis = ''
  let _champEmojis = []
  champEmojis.forEach(emoji => _champEmojis.push(emoji))
  actualEmojis.forEach(message => (prevEmojis = message.content))
  // Matches every emoji name.
  prevEmojis = prevEmojis.split(/(:.*?:)/g).filter(value => value != '')
  const nextEmojis = prevEmojis

  for (let i = 1; i < nextEmojis.length; i++) {
    if (nextEmojis[i] === ':grey_question:') break
    let index = _champEmojis.findIndex(emoji => emoji === nextEmojis[i])
    _champEmojis.splice(index, 1)
  }

  _champEmojis = _champEmojis
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

  const nextIndex = nextEmojis.findIndex(emoji => emoji === ':grey_question:')
  nextEmojis[nextIndex] = _champEmojis.pop()
  return nextEmojis.join('')
}

const showAllEmojis = function (actualEmojis, correctEmojis) {
  actualEmojis.forEach(m => {
    m.edit(`:white_small_square:${correctEmojis.join('')}`)
  })
}
