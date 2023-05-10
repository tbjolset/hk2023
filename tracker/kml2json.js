// node script for converting Google earth klm file to
// json paths

const fs = require('fs');
const kml = fs.readFileSync('./Holmenkollstafetten.kml').toString();

function stripTags(text) {
  return text.replaceAll(/<(.*?)>/g, '').trim();
}

function toStruct(coords) {
  return coords
    .split(' ')
    .map(i => i.split(',')).map(r => ({ lat: Number(r[1]), lng: Number(r[0]) }));
}

const names = kml
  .match(/<name>(.*?)<\/name>/g)
  .map(stripTags)
  .slice(1); // remove header

const coords = kml
  .match(/<coordinates>[\s\S]*?<\/coordinates>/gm)
  .map(stripTags)
  .map(toStruct);

fs.writeFileSync('stages.json', JSON.stringify(coords, null, 2));
