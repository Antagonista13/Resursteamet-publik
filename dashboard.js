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
  const staff = ['A','B','C','D','E'].map((code,index)=>({id:'staff-'+code.toLowerCase(),name:'Medarbetare '+code,index}));
  const assignments = new Map();
  const statuses = ['På plats','Inledande möte','Pedagogiskt möte','Uppföljningsmöte','Avslutande möte','Utskolning','Observation','Handledning','Privat','Annat','Frånvarande'];
  const timeSlots = ['08–10','10–12','12–14','14–16'];
  const renderedStaffViews = new WeakMap();
  function renderStaff(root, selected, view) {
    // Calendar refreshes must not replace focused or open activity controls.
    const renderKey = view+':'+dateKey(selected);
    if (renderedStaffViews.get(root) === renderKey) return;
    const start = addDays(selected,-(selected.getDay()+6)%7);
    const dates = view === 'day' ? [selected] : Array.from({length:5},(_,i)=>addDays(start,i));
    root.replaceChildren();
    for (const person of staff) {
      const row = document.createElement('section'); row.className='staff-person';
      const heading = document.createElement('h3'); heading.textContent=person.name;
      const slots = document.createElement('div'); slots.className='staff-slots';
      for (const date of dates) {
        for (const slot of timeSlots) {
          const key=person.id+':'+dateKey(date)+':'+slot;
          const label=document.createElement('label');
          label.textContent=date.toLocaleDateString('sv-SE',{weekday:'short',day:'numeric',month:'short'})+' · '+slot;
          const input=document.createElement('select');
          input.setAttribute('aria-label',person.name+', '+dateKey(date)+', '+slot);
          for(const status of statuses){const option=document.createElement('option');option.textContent=status;option.value=status;input.append(option);}
          input.value=assignments.get(key) || (date.getDay()===0 || date.getDay()===6 ? 'Frånvarande' : 'På plats');
          input.addEventListener('change',()=>assignments.set(key,input.value));
          label.append(input);slots.append(label);
        }
      }
      row.append(heading,slots);root.append(row);
    }
    renderedStaffViews.set(root,renderKey);
  }
  function renderBreak(config, now) {
    if(config?.version!==1 || config.demo!==true || !Array.isArray(config.breaks) || config.breaks.length>100 || !config.breaks.every(b=>b && typeof b.name==='string' && b.name.trim() && b.name.length<=60 && isDate(b.start) && isDate(b.end) && b.end>=b.start)) throw Error('Ogiltiga testlov');
    const today=dateKey(now);
    const current=config.breaks.filter(b=>b.end>=today).sort((a,b)=>a.start.localeCompare(b.start))[0];
    document.getElementById('break').textContent=current?'TEST · '+current.name:'TESTLOV';
    document.getElementById('breakdate').textContent=current?current.start+' – '+current.end:'Ej officiella läsårstider';
    document.getElementById('break-count').textContent=!current?'Inget kommande testlov angivet':current.start<=today?'Testlov pågår':(dayNumber(localDay(current.start))-dayNumber(now))+' kalenderdagar till testlov';
  }
  return {dateKey,localDay,addDays,dayNumber,isDate,isEvent,readEvents,importEvents,seedEvents,renderStaff,renderBreak};
})();
