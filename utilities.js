import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const ERROR_DELETING_MESSAGES = 50034;

let champsList = randomizeChampions();
let counter = 0;

export const getRandomItem = function (property) {
  return property[Math.floor(Math.random() * property.length)];
};

export const caesarCipher = function (str) {
  if (15 < 0) return caesarShift(str, 15 + 26);
  var output = '';
  str = str.toLowerCase();

  for (var i = 0; i < str.length; i++) {
    var c = str[i];
    var code = str.charCodeAt(i);
    c = String.fromCharCode(((code - 97 + 15) % 26) + 97);
    output += c;
  }

  return output;
};

export const handleErrors = function (interaction, error) {
  console.log(error.rawError || error);
  if (error.code === ERROR_DELETING_MESSAGES)
    return interaction.channel.send(
      'No puedo borrar los mensajes enviados hace mas de 14 dias en este canal.'
    );
};

function randomizeChampions() {
  const champsOrdered = [
    'aatrox',
    'ahri',
    'akali',
    'akshan',
    'alistar',
    'amumu',
    'anivia',
    'annie',
    'aphelios',
    'ashe',
    'aurelionsol',
    'azir',
    'bardo',
    'belveth',
    'blitzcrank',
    'brand',
    'braum',
    'caitlyn',
    'camille',
    'cassiopeia',
    'chogath',
    'corki',
    'darius',
    'diana',
    'drmundo',
    'draven',
    'ekko',
    'elise',
    'evelynn',
    'ezreal',
    'fiddlesticks',
    'fiora',
    'fizz',
    'galio',
    'gangplank',
    'garen',
    'gnar',
    'gragas',
    'graves',
    'gwen',
    'hecarim',
    'heimerdinger',
    'illaoi',
    'irelia',
    'ivern',
    'janna',
    'jarvaniv',
    'jax',
    'jayce',
    'jhin',
    'jinx',
    'ksante',
    'kaisa',
    'kalista',
    'karma',
    'karthus',
    'kassadin',
    'katarina',
    'kayle',
    'kayn',
    'kennen',
    'khazix',
    'kindred',
    'kled',
    'kogmaw',
    'leblanc',
    'leesin',
    'leona',
    'lillia',
    'lissandra',
    'lucian',
    'lulu',
    'lux',
    'malphite',
    'malzahar',
    'maokai',
    'maestroyi',
    'milio',
    'missfortune',
    'mordekaiser',
    'morgana',
    'naafiri',
    'nami',
    'nasus',
    'nautilus',
    'neeko',
    'nidalee',
    'nilah',
    'nocturne',
    'nunuywillump',
    'olaf',
    'orianna',
    'ornn',
    'pantheon',
    'poppy',
    'pyke',
    'qiyana',
    'quinn',
    'rakan',
    'rammus',
    'reksai',
    'rell',
    'renataglasc',
    'renekton',
    'rengar',
    'riven',
    'rumble',
    'ryze',
    'samira',
    'sejuani',
    'senna',
    'seraphine',
    'sett',
    'shaco',
    'shen',
    'shyvana',
    'singed',
    'sion',
    'sivir',
    'skarner',
    'sona',
    'soraka',
    'swain',
    'sylas',
    'syndra',
    'tahmkench',
    'taliyah',
    'talon',
    'taric',
    'teemo',
    'thresh',
    'tristana',
    'trundle',
    'tryndamere',
    'twistedfate',
    'twitch',
    'udyr',
    'urgot',
    'varus',
    'vayne',
    'veigar',
    'velkoz',
    'vex',
    'vi',
    'viego',
    'viktor',
    'vladimir',
    'volibear',
    'warwick',
    'wukong',
    'xayah',
    'xerath',
    'xinzhao',
    'yasuo',
    'yone',
    'yorick',
    'yuumi',
    'zac',
    'zed',
    'zeri',
    'ziggs',
    'zilean',
    'zoe',
    'zyra',
  ];

  const champsShuffled = champsOrdered
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return champsShuffled;
}

export const getNextChamp = function () {
  const champ = champsList[counter];

  if (counter < 161) {
    counter++;
    return champ;
  }
  counter = 0;
  champsList = randomizeChampions();
  return champ;
};

export const readJSON = (path) => require(path)


// const getRandomAbilityV1 = function () {
//   return this.AbilitiesIconsUrl[
//     Math.floor(Math.random() * this.AbilitiesIconsUrl.length)
//   ];
// };

// const getRandomAbilityV2 = function () {
//   return this.Abilities[Math.floor(Math.random() * this.Abilities.length)];
// };

// const getRandomQuote = function () {
//   return this.Frases[Math.floor(Math.random() * this.Frases.length)];
// };
