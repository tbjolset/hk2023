const pollUrl = 'http://kyberheimen.com:5000/trackers'

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
      timestamp: parseInt(Date.now() / 1000),
    });
  };
  return points;
}

async function pollReal() {
  const data = await (await fetch(pollUrl)).json();

  const res = [];
  for (let t = 0; t<5; t++) {
    const el = data.trackers[t];
    res.push({
      id: 'Cisco ' + (t + 1),
      lat: el.pos.lat,
      lng: el.pos.lng,
      timestamp: el.timestamp,
      velocity: el.velocity,
      uncertainty: el.position_uncerntainty,
    });
  }

  return res;
}
