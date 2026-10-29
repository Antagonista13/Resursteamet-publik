/* Shared helpers for the fictional dashboard. No integration credentials or real records. */
window.Dashboard = (() => {
  'use strict';
  const dateKey = d => [String(d.getFullYear()).padStart(4,'0'),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  const localDay = str => new Date(str + 'T12:00:00');
  const addDays = (date, count) => { const d = new Date(date); d.setDate(d.getDate()+count); return d; };
  const dayNumber = d => Math.round(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()) / 86400000);
  const isDate = str => typeof str === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(str) && !Number.isNaN(localDay(str).getTime()) && dateKey(localDay(str)) === str;
  const isEvent = e => !!e && typeof e.id === 'string' && e.id.trim().length > 0 && e.id.length < 100 && isDate(e.date) && typeof e.time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(e.time) && ['work','team'].includes(e.source) && typeof e.title === 'string' && e.title.trim().length > 0 && e.title.length <= 90;
  function readEvents(raw) {
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length > 500 || !data.every(isEvent)) throw Error('Kalendern innehåller ogiltiga testaktiviteter.');
    if (new Set(data.map(e=>e.id)).size !== data.length) throw Error('Kalendern innehåller duplicerade ID.');
    return data.map(({id,date,time,source,title})=>({id,date,time,source,title}));
  }
  function importEvents(parsed, existing) {
    if (parsed?.format !== 'resursteamet-calendar' || parsed.version !== 1 || !Array.isArray(parsed.events)) throw Error('Filen har inte rätt säkerhetskopieringsformat.');
    const imported = readEvents(JSON.stringify(parsed.events));
    const ids = new Set(existing.map(e=>e.id));
    const additions = imported.filter(e=>!ids.has(e.id));
    if (existing.length + additions.length > 500) throw Error('Importen skulle överskrida gränsen på 500 aktiviteter.');
    return additions;
  }
  function seedEvents(now) {
    return [
      {id:'demo-work',date:dateKey(now),time:'08:30',source:'work',title:'TEST · Egen planering'},
      {id:'demo-team',date:dateKey(now),time:'10:00',source:'team',title:'TEST · Teamets avstämning'},
      {id:'demo-next',date:dateKey(addDays(now,1)),time:'09:00',source:'team',title:'TEST · Gemensam uppföljning'}
    ];
  }
  return {dateKey,localDay,addDays,dayNumber,isDate,isEvent,readEvents,importEvents,seedEvents};
})();
