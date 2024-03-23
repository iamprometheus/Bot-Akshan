import { ChampionsModel } from '#localChampionModel'
import { arraysShareItem, strCleaner } from '#utils'
import { updateDatabase } from '#mongo'
import { EmbedBuilder } from 'discord.js'

export const champHandler = async function ({
  commandMessage,
  userMessage,
  correctChamp
}) {
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
      commandMessage,
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

  updateDatabase(commandMessage, userMessage).catch(error =>
    console.error(error)
  )

  return userMessage
    .reply(`¡Lo lograste! La respuesta era ${answer.name}`)
    .catch(error => handleErrors(userMessage, error))
}

const buildChampEmbed = function (answer, comparative) {
  const champEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(answer.name)
    .setDescription(
      `Genero:   ${comparative.gender ? '🟢' : '🔴'} ${answer.gender}\n
        Linea: ${selectColor(comparative.positions)} ${answer.positions}\n
   Especie: ${selectColor(comparative.species)} ${answer.species}\n
  Recurso: ${comparative.resource ? '🟢' : '🔴'} ${answer.resource}\n
   Alcance: ${selectColor(comparative.range_type)} ${answer.range_type}\n
     Region: ${selectColor(comparative.regions)} ${answer.regions}\n
          Año: ${comparative.release_year ? '🟢' : '🔴'} ${answer.release_year}
  `
    )
    .setThumbnail(answer.icon_url)

  return champEmbed
}

const selectColor = function (element) {
  if (element === true) return '🟢'
  if (element === 'partial') return '🟡'
  return '🔴'
}

const compareAnswers = function (answer, correctAnswer) {
  let correct = {}
  correct.gender = answer.gender === correctAnswer.gender ? true : false
  correct.positions = arraysShareItem(answer.positions, correctAnswer.positions)
  correct.species = arraysShareItem(answer.species, correctAnswer.species)
  correct.resource = answer.resource === correctAnswer.resource ? true : false
  correct.range_type = arraysShareItem(
    answer.range_type,
    correctAnswer.range_type
  )
  correct.regions = arraysShareItem(answer.regions, correctAnswer.regions)
  correct.release_year =
    answer.release_year === correctAnswer.release_year ? true : false

  return correct
}
