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

const avatars = [
  "https://avatar-prod-us-east-2.webexcontent.com/Avtr~V1~1eb65fdf-9643-417f-9974-ad72cae0e10f/V1~9f8af81a-6683-4081-8a22-c22f52ad6df8~78ba7d3098eb4436bc81601b99e0112d~40",
  "https://avatar-prod-us-east-2.webexcontent.com/Avtr~V1~1eb65fdf-9643-417f-9974-ad72cae0e10f/V1~ff72cf8cd53669ca05a11688bcfc44bcfbbd61f65167f0acbb72fa2dee26cd63~0771deb8976e461989520eb7e5ab16dc~40",
  "https://avatar-prod-us-east-2.webexcontent.com/Avtr~V1~1eb65fdf-9643-417f-9974-ad72cae0e10f/V1~81599091f0cc0603709c9b578eef40d7adff34d4d20575ad8e03731e26505451~6e580adbd13b47838f080e85424b3207~40",
  "https://avatar-prod-us-east-2.webexcontent.com/Avtr~V1~1eb65fdf-9643-417f-9974-ad72cae0e10f/V1~c6170fd6-e066-4905-8ac6-bde2dffb20ec~5192a4583e614200baddb6dbb6f426a4~40",
  "https://avatar-prod-us-east-2.webexcontent.com/Avtr~V1~1eb65fdf-9643-417f-9974-ad72cae0e10f/V1~2b671164-00d8-43cf-9c58-5c726a011d58~f23f370657314ba19ea656271ca763fb~40",
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
  document.querySelector('button.demo').onclick = () => animateTeams(map, stages);
}

initMap();

