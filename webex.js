/**
 * This script is mean to be used by developer only
 * to fetch avatars and store them in git as urls.
 * Requires bot token
 */

const apiUrl = 'https://webexapis.com/v1/';

const alias = {
  'Alicia Sastre': 'Alicia Garcia Sastre',
  'Hilde Bjerkan': 'Hilde Kristine Bjerkan',
  'Tobias Flatby': 'Tobias Fladby',
  'Sebastian Wood': 'Sebastian Edmund Pedersen Wood',
  'Håkon Sandsmark': 'Håkon Sandsmark', // dont escape å
  'Shubham Garg': 'shgarg2@cisco.com',
};

// valid sizes: 40, 50, 80, 110, 640 and 1600.
function resizeImage(url, size) {
  return url ? url.replace('~1600', '~' + size) : '';
}


function get(url, token) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json; charset=utf-8');
  headers.append('Authorization', `Bearer ${token}`);
  return fetch(url, { method: 'GET', headers })
    .then(r => r.json());
}

async function getPerson(name, token) {
  let n = alias[name] || name.replaceAll('ø', 'o').replaceAll('Ø', 'O').replaceAll('å', 'a').replaceAll('æ', 'ae');
  const url = n.includes('@')
    ? apiUrl + 'people/?email=' + n
    : apiUrl + 'people/?displayName=' + n;

  const res = await get(url, token);

  if (res && res.items?.length ) {
    const person = res.items[0];
    if (person.avatar) {
      const url = resizeImage(person.avatar, 640);
      return url;
    }
    else {
      console.warn('no avatar', name);
    }
  }
  else {
    console.warn('didnt find', name, res.status);
  }
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchAllAvatars(teams, token) {
  const persons = {};
  for (team of teams) {
    for (person of Object.values(team.members)) {
      console.log(`Fetching ${Object.keys(persons).length + 1}: ${person}`);
      const avatar = await getPerson(person, token);
      persons[person] = avatar;
      await sleep(500);
    }
  }
  return persons;
}
