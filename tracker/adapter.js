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


  return [
    {
      id: 'Cisco 1',
      lat: data.trackers[0].pos.lat,
      lng: data.trackers[0].pos.lng,
    },
    {
      id: 'Cisco 2',
      lat: data.trackers[1].pos.lat,
      lng: data.trackers[1].pos.lng,
    },
    {
      id: 'Cisco 3',
      lat: data.trackers[2].pos.lat,
      lng: data.trackers[2].pos.lng,
    },
    {
      id: 'Cisco 4',
      lat: data.trackers[3].pos.lat,
      lng: data.trackers[3].pos.lng,
    },
    {
      id: 'Cisco 5',
      lat: data.trackers[4].pos.lat,
      lng: data.trackers[4].pos.lng,
    },
  ];
}
