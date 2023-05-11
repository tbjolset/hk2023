

// fast stage times (cisco, 2019 -> total time 1:02:34)
const stageTimes = [
  '3:20',
  '3:35',
  '1:48',
  '6:20',
  '3:50',
  '4:35',
  '6:40',
  '4:50',
  '1:45',
  '8:15',
  '4:40',
  '0:59',
  '3:20',
  '2:00',
  '1:30',
];

async function fetchAvatars() {
  return await ((await fetch('./avatars.json')).json());
}


const model = {
  teams: [],
  total: null,

  async init() {
    this.fetchTeams();
    this.avatars = await fetchAvatars();
  },

  async fetchTeams() {
    const data = [];
    for (team of teamData) {
      const t = await fetchTeam(team.url);
      t.name = team.name;
      t.url = team.url;
      t.pace = team.pace;
      this.calculateTimes(t, team.pace);
      data.push(t);
    }

    data.sort((t1, t2) => t1.time < t2.time ? -1 : 1);
    this.teams = data;
    console.log(data);
  },

  calculateTimes(team, pace) {
    team.pace = pace;
    const times = stageTimes.map(time => scaleTime(toTime(time), pace));
    const start = team.time + ':00';
    team.times = times;
    const { schedule, total } = makeSchedule(start, times);
    team.schedule = schedule;
    team.total = total;
  },

  setPace(team, percent) {
    this.calculateTimes(team, percent / 100);
  },

  async fetchAvatars() {
    this.avatars = await ((await fetch('./avatars.json')).json());
  },

  avatar(name) {
    const url = this.avatars[name];
    if (!url) return '';
    return { backgroundImage: `url(${url})` };
  }
}
