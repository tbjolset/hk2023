let map;

const mapCenter = {
  "lat": 59.93873884657666,
  "lng": 10.71438747024135
};

const teams = [
  { name: 'Cisco 1', color: 'green' },
  { name: 'Cisco 2', color: 'blue' },
  { name: 'Cisco 3', color: 'red' },
  { name: 'Cisco 4', color: 'orange' },
  { name: 'Cisco 5', color: 'pink' },
];

let stages;

function interpolate(pos1, pos2, ratio) {
  const lat = pos1.lat + (pos2.lat - pos1.lat) * ratio;
  const lng = pos1.lng + (pos2.lng - pos1.lng) * ratio;
  return { lat, lng };
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}


async function animatePath(path, marker, speed = 100) {
  const pace = 0.4;
  for (let index = 1; index < path.length; index++) {
    const first = path[index - 1];
    const second = path[index];
    for (let ratio = 0; ratio < 1; ratio += pace) {
      const newPos = interpolate(first, second, ratio);
      marker.setPosition(newPos);
      await sleep(speed);
    }
  }
}

async function animateTeam(map, stages, teamNumber) {
  const { Marker } = await google.maps.importLibrary("marker");

  const team = teams[teamNumber];

  const marker = new Marker({
    map,
    position: stages[0][0],
    // label: 'T1',
    icon: `http://maps.google.com/mapfiles/ms/icons/${team.color}-dot.png`,
  });
  const speed = 100 + teamNumber * 10;
  console.log('team', teamNumber, 'speed', speed);

  for (const stage of stages) {
    await animatePath(stage, marker, speed);
  }
}

function animateTeams(map, stages) {
  for (const teamNumber in teams) {
    animateTeam(map, stages, teamNumber);
  }
}

async function addStages(map) {
  const data = await (await fetch('./stages.json')).json();
  data.forEach((stageData) => {
    const path = new google.maps.Polyline({
      path: stageData,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    path.setMap(map);
  });

  stages = data;
}

async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    zoom: 13,
    center: mapCenter,
    mapId: "DEMO_MAP_ID",
  });

  addStages(map);
}

initMap();

document.querySelector('button.demo').onclick = () => animateTeams(map, stages);
