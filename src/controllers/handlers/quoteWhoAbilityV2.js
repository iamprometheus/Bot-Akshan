import { strCleaner } from '#utils'

// handler for quote, who is and abilityV2 games
export const quoteWhoAbilityHandler = async function ({
  commandMessage,
  userMessage,
  correctChamp,
  onWrongAnswer,
  onCorrectAnswer
}) {
  if (!correctChamp) return
  const userAnswer = strCleaner(userMessage.content)

  if (!correctChamp.includes(userAnswer)) {
    return onWrongAnswer(commandMessage.commandName, userMessage)
  }

  return onCorrectAnswer(commandMessage, userMessage)
}
