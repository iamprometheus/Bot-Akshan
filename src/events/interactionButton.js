import { Events } from 'discord.js'
import { getUserStats, updateUserTokens } from '#mongo'
import { getCommand } from './messageCreate.js'
import { handleErrors } from '#utils'
import { getCorrectAnswer } from '#controllers/responseMessage.js'

const HOW_TO_PLAY = `Ya tengo el bot, ¿cómo lo uso?\n
Escribe uno de los siguientes comandos para empezar a jugar.
1) /frase. En este modo tienes que adivinar campeón de acuerdo a una frase dada.
2) /habilidadv1. Decir de que campeón es determinada habilidad de acuerdo a su icono.\n
3) /campeon. Nombrar campeones hasta encontrar el campeón que cumple con las características encontradas.
En este modo de juego tienes que encontrar el campeón que es correcto esa ronda, para eso te tienes que guiar en los circulos de colores.
Si el circulo es rojo 🔴 quiere decir que el campeón que buscas no tiene esa característica, si el circulo es amarillo 🟡 quiere decir que el campeón cuenta parcialmente con algunas de las características, es decir, le faltan o le sobran. si el circulo es verde 🟢 el campeón que buscas tiene esa característica.
4) /emojis. Adivinar el campeón de acuerdo a determinados emojis. (Beta)
5) /habilidadv2. Decir de que campeón es la habilidad de acuerdo al nombre de la misma. (Muy difícil)\n
Al escribir el nombre de un campeón, el bot reaccionará a tu mensaje. 
Si la reacción es ❌ significa que el campeón escrito no es la respuesta correcta, si crees que el nombre del campeón está correcto pero no aparece esta reacción en tu mensaje, es posible que tengas un pequeño error al escribir el nombre.
Si la reacción es ❓ significa que el bot no reconoce el campeón que trataste de escribir, si el campeón consta de dos palabras escribe el nombre completo del campeón (por ejemplo twisted fate).
Si la reacción es ✅ significa que encontraste la respuesta correcta.\n
Es recomendable que el mensaje que persiste en el canal sea el que resulta del comando /iniciar.\n
Para multiples juegos en un mismo servidor, es posible crear mas canales de nombre 'bot-akshan', cada canal será independiente de los demás.
  `

const INFORMATION = `Sobre Akshan.
Akshan es un bot que te permite jugar minijuegos sobre campeones de LoL con tus amigos desde Discord.\n
Cambios de la versión actual.
Se ha agregado Milio a algunos modos.
Se han añadido emojis de algunos campeones.
Nuevo sistema de tokens. Obtienes un token por cada respuesta correcta. Los tokens se usan para revelar pistas, por cada pista se requieren 3 tokens.\n
Características pensadas para agregar en un futuro:
-Servidor dedicado para el bot.
-Tabla de lideres del servidor.\n

---- FAQ ----
¿Cómo jugar? Da click en el botón 'Como Jugar'\n
¿Qué es Akshan Bot? Es un bot con el que puedes jugar distintos minijuegos sobre campeones de LoL (como en loldle.net).\n
¿Por dónde surgió la idea de este bot? La inspiración para la creación de este bot fue la página loldle.net, está hecho sin la restricción de 1 juego al día, con algunas caracteríticas distintas y en español.\n
¿Por qué Akshan? Porque mejorará Discord... un servidor a la vez.\n
El bot dejo de funcionar, ¿cómo hago qué funcione de vuelta? Es posible que se haya apagado, manda mensaje a Kaniel Outis#2772 para resolver la situación.\n
Encontré un bug o errata, ¿donde puedo reportarla? Manda mensaje a Kaniel Outis#2772.\n
¿Cómo agrego el bot a mi servidor? Usando el siguiente enlace https://discord.com/api/oauth2/authorize?client_id=983675368655429682&permissions=2147560464&scope=bot%20applications.commands.\n
Me gusto mucho su trabajo y me gustaría apoyar con el crecimiento del bot, ¿cómo lo hago? Usa el botón de donaciones que aparece con el menu del comando /iniciar.
`

const howToPlayPressed = function (interaction) {
  interaction
    .reply({
      content: HOW_TO_PLAY,
      ephemeral: true
    })
    .catch(error => handleErrors(interaction, error))
}

const statsPressed = async function (interaction) {
  const userStats = await getUserStats(interaction.user.id)
  if (userStats === null) {
    interaction
      .reply({
        content: `No tienes victorias registradas aún.`,
        ephemeral: true
      })
      .catch(error => handleErrors(interaction, error))
  } else {
    interaction
      .reply({
        content: `Tus Estadísticas\n
Juegos ganados:
Campeon: ${userStats.games.campeon}
Frase: ${userStats.games.frase}
Habilidadv1: ${userStats.games.habilidadv1}
Habilidadv2: ${userStats.games.habilidadv2}
Emojis: ${userStats.games.emojis}
Tokens: ${userStats.tokens}
`,
        ephemeral: true
      })
      .catch(error => handleErrors(interaction, error))
  }
}

const HintPressed = async function (interaction) {
  const userStats = await getUserStats(interaction.user.id)
  if (userStats.tokens < 3)
    return interaction.reply({
      content: `Necesitas almenos 3 tokens para revelar la pista, tienes ${userStats.tokens} tokens.`,
      ephemeral: true
    })

  const command = await getCommand(interaction)
  if (!(command ?? false)) return

  const answer = await getCorrectAnswer(command[1], command[0])

  if (!answer) return

  await updateUserTokens(interaction.user.id)

  interaction
    .reply({
      content: `El campeón empieza con la letra: ${answer
        .slice(0, 1)
        .toUpperCase()}.`,
      ephemeral: true
    })
    .catch(error => handleErrors(interaction, error))
}

const infoPressed = function (interaction) {
  interaction
    .reply({
      content: INFORMATION,
      ephemeral: true
    })
    .catch(error => handleErrors(interaction, error))
}

export const name = Events.InteractionCreate
export async function execute (interaction) {
  try {
    if (interaction.guild.members.me.isCommunicationDisabled())
      return interaction
        .reply('Lo siento, estoy aislado por ahora.')
        .catch(error => handleErrors(interaction, error))
  } catch (error) {
    console.log('Interaction Button error', error)
  }

  if (!interaction.isButton()) return

  if (interaction.customId === 'comojugar') return howToPlayPressed(interaction)

  if (interaction.customId === 'stats') return statsPressed(interaction)

  if (interaction.customId === 'hint') return HintPressed(interaction)

  if (interaction.customId === 'info') return infoPressed(interaction)
  return
}
