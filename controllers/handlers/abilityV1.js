import { strCleaner } from '../../utils.js'

export const abilityV1Handler = async function ({
  commandMessage,
  userMessage,
  correctChamp,
  onWrongAnswer,
  onCorrectAnswer
}) {
  const correctAnswer = {
    champ: correctChamp.slice(0, -1),
    ability: correctChamp.slice(-1)
  }

  if (!correctAnswer.ability || !correctAnswer.champ) return

  const userAnswer = strCleaner(userMessage.content)
  if (!correctAnswer.champ.includes(userAnswer)) {
    return onWrongAnswer(commandMessage.commandName, userMessage)
  }
  return onCorrectAnswer(commandMessage, userMessage)
}
