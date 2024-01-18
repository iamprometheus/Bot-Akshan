import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('iniciar')
  .setDescription('Genera el menu cabezera del canal del bot');
export async function execute(interaction) {
  if (interaction.channel.name !== 'bot-akshan')
    return interaction.editReply(
      'Debes estar en el canal bot-akshan para usar este comando.'
    );
  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('comojugar')
      .setLabel('Como Jugar')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('stats')
      .setLabel('Estadísticas')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('info')
      .setLabel('Información')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('hint')
      .setLabel('Pista')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setLabel('Donaciones')
      .setStyle(ButtonStyle.Link)
      .setURL('https://www.paypal.com/paypalme/KanielOutis99')
  );

  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setAuthor({
      name: 'Akshan Bot',
      iconURL: 'https://64.media.tumblr.com/a24beec92b08d6715e5e089e0eed67ad/80aa7c9e782acd69-9b/s400x600/0e018405b732d9ec8a31791e9c8d9a3140f9afc3.jpg',
    })
    .setDescription('Pon a prueba tus conocimientos de LoL con tus amigos.')
    .setThumbnail(
      'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltb450c19403760be7/60dfe7ea979c171ed133dbbb/070721_01AkshanW_Image.png'
    )
    .setImage(
      'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Akshan_10.jpg'
    )
    .setFooter({
      text: 'Mejorando Discord, un servidor a la vez.',
      iconURL: 'https://64.media.tumblr.com/a24beec92b08d6715e5e089e0eed67ad/80aa7c9e782acd69-9b/s400x600/0e018405b732d9ec8a31791e9c8d9a3140f9afc3.jpg',
    });

  try {
    return await interaction.editReply({
      embeds: [exampleEmbed],
      components: [buttons],
    });
  } catch (error) {
    console.log(`Couldn't edit reply start embed`, error);
    return await interaction.channel.send({
      embeds: [exampleEmbed],
      components: [buttons],
    });
  }
}
