import { Events } from 'discord.js'

const enemies = [
  '351241730684747776' // kendall
]

const friends = [
  '531523407980789761', // yo
  '300781778614878209', // fos
  '503076273216815116', // rafa
  '228222886119211010' // yakamaru
]

export const name = Events.VoiceStateUpdate
export async function execute (oldState, newState) {
  if (newState.guild.id !== '650468599231807499') return

  // if (!oldState || !newState) return
  // if (!newState.channel) return
  // //if (newState.channel.id !== '1220203372284477521') return
  // if (!enemies.includes(newState.member.user.id)) return
  // newState.disconnect()
}
