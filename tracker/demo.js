
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function animateTeams(map, stages) {
  for (const teamNumber in teams) {
    animateTeam(map, stages, teamNumber);
  }
}

async function animatePath(path, marker, speed = 100) {
  const pace = 0.2;
  for (let index = 1; index < path.length; index++) {
    const first = path[index - 1];
    const second = path[index];
    for (let ratio = 0; ratio < 1; ratio += pace) {
      const newPos = interpolate(first, second, ratio);
      marker.setPosition(newPos);
      // marker.position = newPos;
      await sleep(speed / 2);
    }
  }
}

async function animateTeam(map, stages, teamNumber) {
  const { Marker, AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const team = teams[teamNumber];


  const marker = new Marker({
    map,
    position: stages[0][0],
    // label: 'T1',
    // icon: {
    //   url: avatars[teamNumber],
    //   scaledSize: new google.maps.Size(32, 32),
    //   origin: new google.maps.Point(0,0),
    //   anchor: new google.maps.Point(0, 0),
    // },
    icon: `http://maps.google.com/mapfiles/ms/icons/${team.color}-dot.png`,
  });

  marker.className = "avatar";

  const speed = 100 + teamNumber * 10;
  console.log('team', teamNumber, 'speed', speed);

  for (const stage of stages) {
    await animatePath(stage, marker, speed);
  }
}