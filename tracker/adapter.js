const pollUrl = 'http://kyberheimen.com:5000/trackers'

const trackerIds = {
  DSJZDCTW: 'Cisco 5',
  EYQOQBBX: 'Cisco 1',
  GYPQIFVS: 'Cisco 4',
  IOSMRZMD: 'Cisco 3',
  NQSCQDCF: 'Cisco 2',
};

function pollMockData() {
  const rand = (max) => Math.floor(Math.random() * max);

  const points = [];
  for (let t = 1; t < 6; t++) {
    const stage = stages[rand(stages.length)];
    const p = stage[rand(stage.length)];
    points.push({
      id: 'Cisco ' + t,
      lat: p.lat,
      lng: p.lng,
      velocity: 5,
      uncertainty: 10,
      timestamp: parseInt(Date.now() / 1000),
    });
  };
  return points;
}

async function pollReal() {
  const data = await (await fetch(pollUrl)).json();

  const res = [];
  for (let t = 0; t<data.trackers.length; t++) {
    const el = data.trackers[t];
    const name = trackerIds[el.id];
    res.push({
      id: name,
      lat: el.pos.lat,
      lng: el.pos.lng,
      timestamp: el.timestamp,
      velocity: el.velocity,
      uncertainty: el.position_uncerntainty,
    });
  }

  return res;
}
