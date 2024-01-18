import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ChampionsModel } from '../models/champions.js';
import { getRandomItem, getNextChamp } from '../utilities.js';

export const data = new SlashCommandBuilder()
  .setName('frase')
  .setDescription('¿Quién dijo la siguiente frase?');
export async function execute(interaction) {
  if (interaction.channel.name !== 'bot-akshan')
    return interaction.editReply(
      'Ve al canal bot-akshan para jugar, si no existe crea uno con /canal.'
    );

  const champ = getNextChamp()
  const quotes = await ChampionsModel.getQuotes({champ})
  const url = quotes[0]

  const quoteEmbed = new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle(getRandomItem(quotes[1]))
    .setAuthor({ name: '¿Qué campeón dijo lo siguiente?', iconURL: url });

  try {
    return await interaction.editReply({ embeds: [quoteEmbed] });
  } catch (error) {
    console.log(`Couldn't edit reply quote embed`, error);
    return await interaction.channel.send({ embeds: [quoteEmbed] });
  }
}
