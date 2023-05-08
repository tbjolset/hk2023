function t(str) {
  const set = str.split(':').map(i => Number(i.trim()));
  if (set.length == 2) {
    return { hour: 0, min: set[0], sec: set[1] };
  }
  return { hour: set[0], min: set[1], sec: set[2] };
}

const toTime = t;

function toSec(time) {
  return parseInt(time.hour * 60 * 60 + time.min * 60 + time.sec);
}

function normalize(time) {
  let { hour, min, sec } = time;
  if (sec >= 60) {
    min += Math.floor(sec / 60);
    sec = sec % 60;
  }
  if (min >= 60) {
    hour += Math.floor(min / 60);
    min = min % 60;
  }
  return { hour, min, sec };
}

function addTimes(t1, t2) {
  // console.log('add', t1, t2);
  let sec = t1.sec + t2.sec;
  let min = t1.min + t2.min;
  let hour = t1.hour + t2.hour;

  return normalize({ hour, min, sec });
}

function guiTime(time) {
  if (!time) return '-';
  const { hour, min, sec } = time;
  const h = hour < 10 ? '0' + hour : hour;
  const m = min < 10 ? '0' + min : min;
  const s = sec < 10 ? '0' + sec : sec;

  return hour < 1 ? `${m}:${s}` : `${h}:${m}:${s}`;
}

function scaleTime(time, factor) {
  const sec = parseInt(toSec(time) * factor);
  return normalize({ hour: 0, min: 0, sec });
}

function makeSchedule(startTime, stages) {
  const times = [t(startTime)];
  stages.forEach(stage => {
    const next = addTimes(times.at(-1), stage);
    times.push(next);
  });

  return times;
}