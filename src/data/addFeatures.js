fs = require('fs');
var name = 'attributes.json';
var data = JSON.parse(fs.readFileSync(name).toString());

for (const [champ, info] of Object.entries(data)) {
  const aka = data[champ].Aka;
  let newAka = aka + '.';
  data[champ].Aka = newAka;
}
fs.writeFileSync(name, JSON.stringify(data));
