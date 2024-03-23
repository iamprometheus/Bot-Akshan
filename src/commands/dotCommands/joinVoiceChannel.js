import ytdl from 'ytdl-core'
import ytSearch from 'yt-search'
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} from '@discordjs/voice'
import { isUrl } from '#utils'

export const JoinAndPlay = (channelId, guildId, adapterCreator, args) => {
  const connection = joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator
  })
  playAudio(connection, args)
}

async function playAudio (connection, args) {
  const vidFind = async query => {
    const vidRes = await ytSearch(query)
    return vidRes.videos.length > 1 ? vidRes.videos[0] : null
  }
  const video = isUrl(args.join(''))
    ? args.join('')
    : await vidFind(args.join('')).url

  const player = createAudioPlayer()

  if (video) {
    const stream = ytdl(video, { filter: 'audioonly' })
    const resource = createAudioResource(stream)
    player.play(resource)
  }
  // let resource = createAudioResource(createReadStream(audioFile))
  // player.play(resource)

  connection.subscribe(player)

  player.on('error', error => {
    console.error(error)
  })
  player.on(AudioPlayerStatus.Idle, () => {
    connection.destroy()
  })
}
