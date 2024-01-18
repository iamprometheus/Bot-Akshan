import { ChampionsModel } from "../models/champions.js";
import { caesarCipher } from "../utilities.js";
import { updateDatabase } from '../mongo.js';
import { EmbedBuilder } from "discord.js";

export const gamesHandler = async function( { commandName, commandMessage, userMessage} ) {
  try {
    switch (commandName){
      case 'habilidadv1':
        return abilityV1Handler(commandMessage, userMessage);
      case'campeon':
        return champHandler(commandMessage, userMessage);
      case'habilidadv2':
        return abilityV2Handler(commandMessage, userMessage);
      case 'frase':
        return quoteHandler(commandMessage, userMessage);
      case 'quienes':
        return whoIsHandler(commandMessage, userMessage);
      case 'emojis':
        return emojisHandler(commandMessage, userMessage);
      default:
        return console.log('????')
    }
  } catch (error) {
    console.log('Command error', command, error);
  }
}

const abilityV1Handler = async function (abilityMessage, userMessage) {
  const correctAnswer = {
    champ: '',
    ability: '',
  };

  let encriptedInfo;
  try {
    encriptedInfo = getCorrectAnswer(abilityMessage, 'habilidadv1');
  } catch (error) {
    userMessage.channel
      .send('Espera que cargue la habilidad, ¡velocista!')
      .catch((error) => handleErrors(userMessage, error));
  }

  correctAnswer.champ = encriptedInfo.slice(0, -1)
  correctAnswer.ability = encriptedInfo.slice(-1)

  if (!correctAnswer.ability || !correctAnswer.champ) return;

  const userAnswer = getUserAnswer(userMessage);
  if (!correctAnswer.champ.includes(userAnswer)) {
    return onWrongAnswer(abilityMessage.commandName, userMessage);
  }
  return onCorrectAnswer(abilityMessage, userMessage);
};

const abilityV2Handler = async function (abilityMessage, userMessage) {
  const correctAnswer = {
    champ: '',
    ability: '',
  };

  try {
    correctAnswer.champ = getCorrectAnswer(abilityMessage, 'habilidadv2');
  } catch (error) {
    userMessage.channel
      .send('Espera que cargue la habilidad, ¡velocista!')
      .catch((error) => handleErrors(userMessage, error));
  }
  if (!correctAnswer.champ) return;

  const userAnswer = getUserAnswer(userMessage);

  if (!correctAnswer.champ.includes(userAnswer)) {
    return onWrongAnswer(abilityMessage.commandName, userMessage);
  }

  return onCorrectAnswer(abilityMessage, userMessage);
};

const quoteHandler = async function (quoteMessage, userMessage) {
  let correctAnswer;
  
  try {
    correctAnswer = getCorrectAnswer(quoteMessage, 'frase');
  } catch (error) {
    return userMessage.channel
      .send('Espera que cargue la frase, ¡velocista!')
      .catch((error) => handleErrors(userMessage, error));
  }

  if (!correctAnswer) return;
  const userAnswer = getUserAnswer(userMessage);

  if (!correctAnswer.includes(userAnswer)) {
    return onWrongAnswer(quoteMessage.commandName, userMessage);
  }

  return onCorrectAnswer(quoteMessage, userMessage);
};

const whoIsHandler = async function (whoIsMessage, userMessage) {
  let correctAnswer;
  try {
    correctAnswer = getCorrectAnswer(whoIsMessage, 'quienes');
  } catch (error) {
    userMessage.channel
      .send('Espera que cargue el apodo, ¡velocista!')
      .catch((error) => handleErrors(userMessage, error));
  }

  if (!correctAnswer) return;
  const userAnswer = getUserAnswer(userMessage);

  if (!correctAnswer.includes(userAnswer)) {
    return onWrongAnswer(whoIsMessage.commandName, userMessage);
  }

  return onCorrectAnswer(whoIsMessage, userMessage);
};

const champHandler = async function (champMessage, userMessage) {
  let correctChamp;

  try {
    correctChamp = getCorrectAnswer(champMessage, 'campeon');
  } catch (error) {
    userMessage.channel
      .send('Espera que cargue el campeón, ¡velocista!')
      .catch((error) => handleErrors(userMessage, error));
  }
  if (!correctChamp) return;

  const userChamp = getUserAnswer(userMessage);
  const correctAnswer = await ChampionsModel.getAttributes( {champ: correctChamp} );
  const answer = await ChampionsModel.getAttributes( {champ: userChamp} );
  
  try {
    if (!answer) return userMessage.react('❓');
  } catch (error) {
    console.log(error);
  }
  
  //Comparar respuestas
  let comparativa;
  try {
    comparativa = compareAnswers(answer, correctAnswer);
  } catch (error) {
    console.log(
      'Error Comparing Champs',
      answer,
      correctChamp,
      correctAnswer,
      champMessage,
      userMessage,
      error
    );
    return;
  }

  let champEmbed = buildChampEmbed(answer, comparativa)

  userMessage.channel
    .send({ embeds: [champEmbed] })
    .catch((error) => handleErrors(userMessage, error));

  for (const value of Object.values(comparativa)) {
    if (value == false || value == 'partial') return;
  }

  updateDatabase(champMessage, userMessage).catch((error) =>
    console.log(error)
  );
  return userMessage
    .reply(`¡Lo lograste! La respuesta era ${answer.Nombre}`)
    .catch((error) => handleErrors(userMessage, error));
};

const buildChampEmbed = function (answer, comparative) {
  const champEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(answer.Nombre)
    .setDescription(
      `
  Genero:  ${comparative.Gender ? '🟢' : '🔴'} ${answer.Gender}\n
  Linea:   ${
    comparative.Positions == true
      ? '🟢'
      : comparative.Positions == 'partial'
      ? '🟡'
      : '🔴'
  } ${answer.Positions}\n
  Especie: ${
    comparative.Species == true
      ? '🟢'
      : comparative.Species == 'partial'
      ? '🟡'
      : '🔴'
  } ${answer.Species}\n
  Recurso: ${comparative.Resource ? '🟢' : '🔴'} ${answer.Resource}\n
  Alcance: ${
    comparative.RangeType == true
      ? '🟢'
      : comparative.RangeType == 'partial'
      ? '🟡'
      : '🔴'
  } ${answer.RangeType}\n
  Region:  ${
    comparative.Region == true
      ? '🟢'
      : comparative.Region == 'partial'
      ? '🟡'
      : '🔴'
  } ${answer.Region}\n
  Año:     ${comparative.ReleaseYear ? '🟢' : '🔴'} ${answer.ReleaseYear}
  `
    )
    .setThumbnail(answer.IconUrl)

  return champEmbed
}

const arraysShareItem = function (answer, correctAnswer) {
  // Ambas variables no son array
  if (!Array.isArray(answer) && !Array.isArray(correctAnswer))
    return answer === correctAnswer;

  // Ambas variables son array
  if (Array.isArray(answer) && Array.isArray(correctAnswer)) {
    for (const value of answer.values()) {
      if (correctAnswer.some((element) => element === value)) return true;
    }
  }
  // La primera variable no es array
  if (!Array.isArray(answer) && Array.isArray(correctAnswer)) {
    if (correctAnswer.some((element) => element === answer)) return true;
  }
  // La segunda variable no es array
  if (Array.isArray(answer) && !Array.isArray(correctAnswer)) {
    for (const value of answer.values()) {
      if (correctAnswer === value) return true;
    }
  }
  return false;
};

const compareAnswers = function (answer, correctAnswer) {
  let correct = {};

  correct.Gender = answer.Gender === correctAnswer.Gender ? true : false;
  correct.Positions =
    answer.Positions === correctAnswer.Positions
      ? true
      : arraysShareItem(answer.Positions, correctAnswer.Positions)
      ? 'partial'
      : false;
  correct.Species =
    answer.Species === correctAnswer.Species
      ? true
      : arraysShareItem(answer.Species, correctAnswer.Species)
      ? 'partial'
      : false;
  correct.Resource = answer.Resource === correctAnswer.Resource ? true : false;
  correct.RangeType =
    answer.RangeType === correctAnswer.RangeType
      ? true
      : arraysShareItem(answer.RangeType, correctAnswer.RangeType)
      ? 'partial'
      : false;
  correct.Region =
    answer.Region === correctAnswer.Region
      ? true
      : arraysShareItem(answer.Region, correctAnswer.Region)
      ? 'partial'
      : false;
  correct.ReleaseYear =
    answer.ReleaseYear == correctAnswer.ReleaseYear ? true : false;

  return correct;
};

const emojisHandler = async function (emojisMessage, userMessage) {
  let messages = await userMessage.channel.messages.fetch({
    limit: 10,
    cache: true,
  });

  let correctAnswer;
  try {
    correctAnswer = getCorrectAnswer(emojisMessage, 'emojis');
  } catch (error) {
    return userMessage.channel
      .send('Espera que carguen los emojis, ¡velocista!')
      .catch((error) => handleErrors(userMessage, error));
  }

  let actualEmojis = messages.filter((m) =>
    m.content.startsWith(':white_small_square:')
  );

  const userAnswer = getUserAnswer(userMessage);
  const emojis = await ChampionsModel.getEmojis({ champ: correctAnswer });

  if (!correctAnswer.includes(userAnswer)) {
    try {
      actualEmojis.forEach((m) => {
        m.edit(showNextEmoji(actualEmojis, emojis));
      });
      return userMessage.react('❌');
    } catch (error) {
      return console.log(`Error reacting in emojis response`, error);
    }
  }

  showAllEmojis(actualEmojis, emojis);
  return onCorrectAnswer(emojisMessage, userMessage);
};

const showNextEmoji = function (actualEmojis, correctEmojis) {
  const nextEmojis = [];
  let champEmojis = correctEmojis;
  let prevEmojis;
  actualEmojis.forEach((message) => (prevEmojis = message.content));
  let emojiRegex = /(:.*?:)/g; // Matches every emoji name.
  prevEmojis = prevEmojis.split(emojiRegex).filter((value) => value != '');
  prevEmojis.forEach((emoji) =>
    emoji != ':grey_question:' ? nextEmojis.push(emoji) : 1
  );

  let length = prevEmojis.length;
  let tempNextEmojis = nextEmojis.slice(1);

  if (tempNextEmojis.length === champEmojis.length) return;

  champEmojis = champEmojis.filter((value) => {
    const index = tempNextEmojis.indexOf(value);
    if (index != -1) {
      if (index == 0) {
        tempNextEmojis = tempNextEmojis.slice(1);
        return false;
      }
      if (index == tempNextEmojis.length - 1) {
        tempNextEmojis = tempNextEmojis.slice(0, -1);
        return false;
      }
      tempNextEmojis = tempNextEmojis
        .slice(0, index)
        .concat(tempNextEmojis.slice(index + 1));
      return false;
    }
    return true;
  });

  champEmojis = champEmojis
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  nextEmojis.push(champEmojis.pop());

  for (let i = nextEmojis.length - 1; i < length - 1; i++) {
    nextEmojis.push(':grey_question:');
  }

  return nextEmojis.join('');
};

const showAllEmojis = function (actualEmojis, correctEmojis) {
  actualEmojis.forEach((m) => {
    m.edit(`:white_small_square:${correctEmojis.join('')}`);
  });
};

const getUserAnswer = function (userMessage) {
  return userMessage.content
    .toLowerCase()
    .replaceAll(`'`, '')
    .replaceAll(' ', '')
    .replaceAll('.', '');
};

export const getCorrectAnswer = function (commandMsg, command) {
  if (command != 'habilidadv1')
    return caesarCipher(
      commandMsg.embeds[0].data.author.icon_url.split('/')[5].split('.p')[0]
    );

  return caesarCipher(
    commandMsg.embeds[0].data.image.url.split('/')[5].split('.p')[0]
  )
};

const onCorrectAnswer = async function (commandMsg, userMsg) {
  await updateDatabase(commandMsg, userMsg).catch((error) =>
    console.log(error)
  );

  userMsg.react('✅').catch((error) => handleErrors(userMsg, error));
  return userMsg
    .reply(`¡Correcto!`)
    .catch((error) => handleErrors(userMsg, error));
};

const onWrongAnswer = function (command, userMsg) {
  try {
    return userMsg.react('❌');
  } catch (error) {
    console.log(`Error reacting in ${command} response`, error);
    return;
  }
};

