import { EmbedBuilder } from 'discord.js'

export function imageTextEmbed (text, iconUrl) {
  return new EmbedBuilder().setTitle(text).setImage(iconUrl)
}

export function authorTextEmbed (author, iconUrl, text, color) {
  return new EmbedBuilder()
    .setAuthor({
      name: author,
      iconURL: iconUrl
    })
    .setTitle(text)
    .setColor(color)
}

export function fullEmbed (
  author,
  description,
  thumbnail,
  image,
  iconUrl,
  footer,
  color
) {
  return new EmbedBuilder()
    .setColor(color)
    .setAuthor({
      name: author,
      iconURL: iconUrl
    })
    .setDescription(description)
    .setThumbnail(thumbnail)
    .setImage(image)
    .setFooter({
      text: footer,
      iconURL: iconUrl
    })
}

export function channelHeaderEmbed () {
  return new EmbedBuilder()
    .setColor(0x0099ff)
    .setAuthor({
      name: 'Akshan Bot',
      iconURL:
        'https://64.media.tumblr.com/a24beec92b08d6715e5e089e0eed67ad/80aa7c9e782acd69-9b/s400x600/0e018405b732d9ec8a31791e9c8d9a3140f9afc3.jpg'
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
      iconURL:
        'https://64.media.tumblr.com/a24beec92b08d6715e5e089e0eed67ad/80aa7c9e782acd69-9b/s400x600/0e018405b732d9ec8a31791e9c8d9a3140f9afc3.jpg'
    })
}
