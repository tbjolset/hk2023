let map;
let Marker;

const mapCenter = {
  "lat": 59.93650304183593,
  "lng": 10.70434527968958
}

const pollIntervalSec = 10;

const teams = [
  { id: 'Cisco 1', color: 'green' },
  { id: 'Cisco 2', color: 'blue' },
  { id: 'Cisco 3', color: 'red' },
  { id: 'Cisco 4', color: 'orange' },
  { id: 'Cisco 5', color: 'pink' },
];

let stages;

const teamMarkers = [];

async function pollTrackingData() {
  const mock = location.search.includes('dev');
  const data = mock ? await pollMockData() : await pollReal();
  data.forEach((point) => {
    const marker = teamMarkers.find(t => t.id === point.id)?.marker;
    marker.setPosition(point);
  })
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

async function addStages(map) {
  const data = await (await fetch('./stages.json')).json();

  data.forEach((stageData, i) => {
    const path = new google.maps.Polyline({
      path: stageData,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    path.setMap(map);

    // start of stage marker
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
  teams.forEach((team) => {
    const marker = new Marker({
      map,
      position: stages[0][0],
      icon: `http://maps.google.com/mapfiles/ms/icons/${team.color}-dot.png`,
    });
    teamMarkers.push({ id: team.id, marker });
  });

  console.log(teamMarkers);
}

async function showGpsFile(map, file) {
  const positions = await (await fetch(file)).json();
  console.log('got', positions);
  positions.forEach((pos, i) => {
    const marker = new Marker({
      map,
      position: pos,
      label: String(i + 1),
      icon: {
        url: `http://maps.google.com/mapfiles/kml/pal2/icon26.png`,
        scaledSize: {
          width: 25,
          height: 25,
        },
      },
    });
  });
}

async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  Marker = (await google.maps.importLibrary("marker")).Marker;
  map = new Map(document.getElementById("map"), {
    zoom: 13,
    center: mapCenter,
    mapId: "hk-map",
    // mapTypeId: 'terrain',
  });

  map.addListener('click', onMapClick);
  // await addStages(map);
  // createTeamMarkers(map, teams);
  // pollTrackingData();
  // setInterval(pollTrackingData, pollIntervalSec * 1000);
  showGpsFile(map, './testtrack.json');
}

initMap();

