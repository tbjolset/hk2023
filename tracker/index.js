let map;
let Marker;

const hvalstad = { lat: 59.86421811683712, lng: 10.46892377064593 };
const hk = { lat: 59.93650304183593, lng: 10.70434527968958 };
const mapCenter = hk;

const pollIntervalSec = 5;
const mapZoom = 13; // 13
const tooOldData = 120;

const teams = [
  { id: 'Cisco 1', color: 'green' },
  { id: 'Cisco 2', color: 'blue' },
  { id: 'Cisco 3', color: 'red' },
  { id: 'Cisco 4', color: 'orange' },
  { id: 'Cisco 5', color: 'pink' },
];

let stages;
let avatars = {};

const teamMarkers = [];

async function pollTrackingData() {
  const mock = location.search.includes('dev');
  const data = mock ? await pollMockData() : await pollReal();
  data.forEach((point, i) => {
    const marker = teamMarkers.find(t => t.id === point.id)?.marker;
    marker.setPosition(point);
    const age = parseInt((Date.now() / 1000) - point.timestamp);
    const time = new Date(point.timestamp * 1000);
    const tooOld = age > tooOldData;
    // console.log('point', point.id, 'age', age, 's');

    // const tooOld= Math.random() < 0.3;

    // just random avatar for creating a demo
    let teamMarker = getMarkerUrl(i);
    const list = Object.keys(avatars);
    if (list.length) {
      const index = Math.floor(Math.random() * list.length);
      const avatar = avatars[list[index]];
      console.log(index, avatar);
      if (avatar) {
        teamMarker = avatar.replace('~640', '~40');
      }
    }


    const icon = tooOld
      ? 'http://maps.google.com/mapfiles/kml/shapes/caution.png'
      : teamMarker;

     marker.setIcon(icon);

    // todo: old data icon:
    // url: 'http://maps.google.com/mapfiles/kml/shapes/caution.png',30,30
  })
}

function findStage(point) {
  console.log('find', point);
  const team = 0;
  const stage = 0;
  return {
    team,
    stage,
  };
}

function interpolate(pos1, pos2, ratio) {
  const lat = pos1.lat + (pos2.lat - pos1.lat) * ratio;
  const lng = pos1.lng + (pos2.lng - pos1.lng) * ratio;
  return { lat, lng };
}

function calcDist(p1, p2) {
  return google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
}

function calcLength(path) {
  return google.maps.geometry.spherical.computeLength(path);
}

function getMarkerUrl(teamIndex) {
  const col = teams[teamIndex].color;
  return `http://maps.google.com/mapfiles/ms/icons/${col}-dot.png`;
}

async function addStages(map) {
  const data = await (await fetch('./stages.json')).json();

  data.forEach((stageData, i) => {
    const path = new google.maps.Polyline({
      path: stageData,
      geodesic: true,
      strokeColor: '#00aacc',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    path.setMap(map);

    const marker = new Marker({
      map,
      label: String(i + 1),
      position: stageData[0],
      icon: {
        url: `http://maps.google.com/mapfiles/kml/pal2/icon26.png`,
        scaledSize: {
          width: 25,
          height: 25,
        },
      },
    });
  });

  stages = data;
}

function onMapClick(event) {
  const loc = { lat: event.latLng.lat(), lng: event.latLng.lng() };
  console.log(loc);
}

function createTeamMarkers(map, teams) {
  teams.forEach((team, i) => {
    const marker = new Marker({
      map,
      position: stages[0][0],
      icon: {
        url: getMarkerUrl(i),
        scaledSize: {
          width: 50,
          height: 50,
        }
      }
    });
    teamMarkers.push({ id: team.id, marker });
  });

  console.log(teamMarkers);
}

async function showGpsFile(map, file) {
  const samples = await (await fetch(file)).json();
  const t1 = samples.map(i => i.trackers[0].pos);
  const t2 = samples.map(i => i.trackers[1].pos);
  const t3 = samples.map(i => i.trackers[2].pos);
  const t4 = samples.map(i => i.trackers[3].pos);
  const t5 = samples.map(i => i.trackers[4].pos);
  const all = [t1, t2, t3, t4, t5];

  const colors = ['red', 'blue', 'orange', 'green', 'pink'];
  all.forEach((tracker, i) => {
    const path = new google.maps.Polyline({
      path: tracker,
      geodesic: true,
      strokeColor: colors[i],
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    path.setMap(map);
  });
}

async function fetchAvatars() {
  return await ((await fetch('../avatars.json')).json());
}

async function fetchTeams() {
  const data = [];
  for (const team of teamData) {
    const t = await fetchTeam(team.url);
    t.name = team.name;
    t.pace = team.pace;
    data.push(t);
  }
  console.log('teams', data);
}

async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  Marker = (await google.maps.importLibrary("marker")).Marker;
  map = new Map(document.getElementById("map"), {
    zoom: mapZoom,
    center: mapCenter,
    // mapTypeId: 'terrain',
  });

  map.addListener('click', onMapClick);
  await addStages(map);
  await fetchTeams();
  createTeamMarkers(map, teams);
  pollTrackingData();
  setInterval(pollTrackingData, pollIntervalSec * 1000);
  // showGpsFile(map, './testtrack.json');
  map.setOptions({
    styles: config.mapStyles,
  });
  avatars = await fetchAvatars();
  // showGpsFile(map, './second-bikeride.json');
}

initMap();

