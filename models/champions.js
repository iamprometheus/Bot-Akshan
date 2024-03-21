import { readJSON } from '../utils.js'
const champs = readJSON('./data/data.json')

export const normalizeName = function (name) {
  return name.toLowerCase().replace(' ', '').replace(`'`, '').replace('.', '')
}

export class ChampionsModel {
  static async getAllData () {
    return champs
  }

  static async getAllChamps () {
    let listOfChampions = []
    for (let champ of champs) listOfChampions.push(normalizeName(champ.Nombre))
    return listOfChampions
  }

  static async getChampByName ({ champ }) {
    return champs.find(c => normalizeName(c.Nombre) === normalizeName(champ))
  }

  static async getAbilities ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.Nombre) === normalizeName(champ)
    )
    return [champObject.EncryptedChampIconUrl, champObject.Abilities]
  }

  static async getAbilitiesIconsUrl ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.Nombre) === normalizeName(champ)
    )
    return champObject.AbilitiesIconsUrl
  }

  static async getEmojis ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.Nombre) === normalizeName(champ)
    )
    return [champObject.EncryptedChampIconUrl, champObject.Emojis]
  }

  static async getQuotes ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.Nombre) === normalizeName(champ)
    )
    return [champObject.EncryptedQuoteIconUrl, champObject.Frases]
  }

  static async getAka ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.Nombre) === normalizeName(champ)
    )
    return [champObject.EncryptedChampIconUrl, champObject.Aka]
  }

  static async getAttributes ({ champ }) {
    let champObject = champs.find(
      c => normalizeName(c.Nombre) === normalizeName(champ)
    )

    let attributes = {}
    attributes['Nombre'] = champObject.Nombre
    attributes['Gender'] = champObject.Gender
    attributes['Positions'] = champObject.Positions
    attributes['Species'] = champObject.Species
    attributes['Resource'] = champObject.Resource
    attributes['RangeType'] = champObject.RangeType
    attributes['Region'] = champObject.Region
    attributes['ReleaseYear'] = champObject.ReleaseYear
    attributes['IconUrl'] = champObject.IconUrl

    return attributes
  }
}
