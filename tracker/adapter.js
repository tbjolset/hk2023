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