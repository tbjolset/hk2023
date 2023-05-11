function findAll(el, selector) {
  return Array.from(el.querySelectorAll(selector));
}
function parse(html) {

  const doc = document.createElement('html');
  doc.innerHTML = html;

  const items = findAll(doc, 'li');
  const start = items.find(i => i.innerText.includes('starts'));
  const time = start.innerText.match(/\d\d:\d\d/)?.[0];
  const stairs = items.find(i => i.innerText.toLowerCase().includes('stairs'));
  const meet = stairs.innerText.match(/\d\d:\d\d/)?.[0];
  const startNo = items.find(i => i.innerText.includes('Start number'));
  const number = startNo.innerText.match(/\d+/)?.[0];

  const rows = findAll(doc, 'tr');
  rows.shift(); // remove header
  const members = {};
  rows.forEach(row => {
    const [pos, time, name] = findAll(row, 'td').map(c => c.innerText);
    members[pos] = name.trim();
  });

  return { meet, time, members, number };
}

async function fetchTeam(url) {
  const res = await fetch(url);
  const text = await res.text();
  return parse(text);
}

const teamData = [
  {
    name: 'Cisco 1 Intermediate',
    url: 'https://docs.google.com/document/d/e/2PACX-1vRuU3iR9Ai5BfkBChwS58H9kEGXatXH8F99iGybzfdyNePTVWp6ptheBj8REcZdoRbBqJ7FINnYcKmv/pub',
    pace: 1.25,
  },
  {
    name: 'Cisco 2 Pro',
    url: 'https://docs.google.com/document/d/e/2PACX-1vSbCaC3QOSx1i6gASg5q-cKjpcHu3W74LjZAiHt7eSigtNbzGFVsXL1evN5_0JAU68Ms3mrYmna0eBQ/pub',
    pace: 1.0,
  },
  {
    name: 'Team 3 Run For Fun',
    url: 'https://docs.google.com/document/d/e/2PACX-1vTjPjzHLB_G5CSUmvJHVgBg1yRhrLVHMhTL_wY9u4666khfTsYQmkNE2x_aEdJzLkfN9YtS_cEKeRf9/pub',
    pace: 1.4,
  },
  {
    name: 'Team 4 Run For Fun',
    url: 'https://docs.google.com/document/d/e/2PACX-1vTAAzckBMt1WDrdKCeHa9TRAqRWanR6noT5JXlXXZJn0AXXu_lT6Jb0LeN5iYAN-pGG1IUuegatIJ1l/pub',
    pace: 1.4,
  },
  {
    name: 'Team 5 Intermediate',
    url: 'https://docs.google.com/document/d/e/2PACX-1vTzUoyHwSZjQvMFcLz4RgtD8aLUcTTgzPkibqZwq6JZOzhMt3OR8blDpdsInIECdqAs3Ee7VJKBGh3j/pub',
    pace: 1.25,
  },
];