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
    });
  };
  return points;
}

const mock ={
  "trackers": [
    {
      "altitude": 23,
      "id": "DSJZDCTW",
      "pos": {
        "lat": 59.90892,
        "lng": 10.62212
      },
      "timestamp": 1683812036,
      "velocity": 1.5
    }
  ]
};

const allData = [];

async function pollReal() {
  const data = await (await fetch(pollUrl)).json();
  // const data = mock;
  allData.push(data);
  console.log(allData);

  const res = [];
  for (let t = 0; t<5; t++) {
    res.push({
      id: 'Cisco ' + (t + 1),
      lat: data.trackers[t].pos.lat,
      lng: data.trackers[t].pos.lng,
    })
  }

  return res;
}
