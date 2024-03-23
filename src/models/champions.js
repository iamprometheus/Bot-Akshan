import { readJSON } from '#utils'
const champs = readJSON('../data/data.json')

export const normalizeName = function (name) {
  return name
    .toLowerCase()
    .replaceAll(' ', '')
    .replaceAll(`'`, '')
    .replaceAll('.', '')
}

export class ChampionsModel {
  static async getAllData () {
    return champs
  }

  static async getAllChamps () {
    let listOfChampions = []
    for (let champ of champs) listOfChampions.push(normalizeName(champ.name))
    return listOfChampions
  }

  static async getChampByName ({ champ }) {
    return champs.find(c => normalizeName(c.name) === normalizeName(champ))
  }

  static async getAbilities ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.name) === normalizeName(champ)
    )

    return [champObject.encrypted_champ_icon_url, champObject.abilities]
  }

  static async getAbilitiesIconsUrl ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.name) === normalizeName(champ)
    )
    return champObject.abilities_icons_url
  }

  static async getEmojis ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.name) === normalizeName(champ)
    )
    return [champObject.encrypted_champ_icon_url, champObject.emojis]
  }

  static async getQuotes ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.name) === normalizeName(champ)
    )
    return [champObject.encrypted_quote_icon_url, champObject.quotes]
  }

  static async getAka ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.name) === normalizeName(champ)
    )
    return [champObject.encrypted_champ_icon_url, champObject.aka]
  }

  static async getAttributes ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.name) === normalizeName(champ)
    )

    let attributes = {}
    attributes['name'] = champObject.name
    attributes['gender'] = champObject.gender
    attributes['positions'] = champObject.positions
    attributes['species'] = champObject.species
    attributes['resource'] = champObject.resource
    attributes['range_type'] = champObject.range_type
    attributes['regions'] = champObject.regions
    attributes['release_year'] = champObject.release_year
    attributes['icon_url'] = champObject.icon_url

    return attributes
  }
}
