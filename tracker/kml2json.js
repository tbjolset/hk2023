// node script for converting Google earth klm file to
// json paths

const fs = require('fs');

const input = './Holmenkollstafetten.kml';
const output = 'stages.json';

const kml = fs.readFileSync(input).toString();

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


fs.writeFileSync(output, JSON.stringify(coords, null, 2));
console.log('converted', input, 'to', output);