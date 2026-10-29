const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element {
 constructor(tag='div'){this.tag=tag;this.children=[];this.style={};this.dataset={};this.listeners={};this.hidden=false;this.className='';this.textContent='';this.value='';this.classList={add:c=>this.className+=' '+c};}
 append(...children){this.children.push(...children);}
 replaceChildren(...children){this.children=[...children];}
 setAttribute(name,value){this[name]=value;}
 removeAttribute(name){delete this[name];}
 addEventListener(event,fn){this.listeners[event]=fn;}
 scrollIntoView(){}
}
async function main(){
 const html=fs.readFileSync('mobil.html','utf8'),nodes=new Map();
 for(const [,id] of html.matchAll(/id="([^"]+)"/g))nodes.set(id,new Element());
 nodes.get('horizon-select').value='6';
 const tabs=['idag','planering','teamet','kontakter','mer'].map(name=>{const el=new Element('button');el.dataset.tab=name;return el;});
 const document={getElementById:id=>nodes.get(id)||null,createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text}),querySelectorAll:selector=>selector==='[data-tab]'?tabs:selector==='.screen'?[...nodes.entries()].filter(([id])=>id.startsWith('screen-')).map(([id,el])=>{el.id=id;return el;}):[]};
 const fetches=[];
 const context=vm.createContext({document,window:{scrollTo(){}},confirm:()=>true,sessionStorage:{getItem(){return null},setItem(){}},console,fetch:async url=>{fetches.push(url);return {ok:true,json:async()=>url==='menu.json'?{meals:[]}:{current:{temperature_2m:8}}}}});
 vm.runInContext(fs.readFileSync('dashboard.js','utf8'),context);
 context.Dashboard=context.window.Dashboard;
 const inline=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
 let startupError;
 try{vm.runInContext(inline,context);}catch(e){startupError=e;}
 await new Promise(resolve=>setImmediate(resolve));
 const meetings=nodes.get('home-meetings').children;
 assert.ok(meetings.length>=6,'at least six home meetings must render; got '+meetings.length+'; startup error: '+startupError);
 assert.equal(startupError,undefined);
 assert.ok(meetings.some(x=>x.className.includes('is-exit')));
 assert.ok(meetings.some(x=>x.children.some(c=>c.textContent.includes('Utskolning · Elev C'))));
 assert.equal(nodes.get('student-content').children.length,11);
 assert.equal(fetches.length,2);
 assert.equal(nodes.get('weather-temp').textContent,'8°');
 assert.equal(nodes.get('menu-today').textContent,'Ingen aktuell matsedel');
 tabs.find(x=>x.dataset.tab==='teamet').listeners.click();
 const teamStatus=(person)=>{let active=false;return nodes.get('team-list').children.filter(el=>{if(el.tag==='h3'){active=el.textContent===person;return false;}return active;}).map(row=>row.children.map(c=>c.textContent).join(' · ')).join(' / ');};
 assert.match(teamStatus('Medarbetare D'),/10:00–12:00 · Utskolning · Elev C/);
 const teamText=()=>nodes.get('team-list').children.map(el=>el.textContent+' '+el.children.map(c=>c.textContent).join(' ')).join(' ');
 assert.ok(!teamText().includes('Ingen bokning'));
 assert.ok(!teamText().includes('På plats'));
 assert.equal((teamStatus('Medarbetare C').match(/Observation/g)||[]).length,1,'cross-slot observation appears once');
 tabs.find(x=>x.dataset.tab==='planering').listeners.click();
 const agenda=nodes.get('agenda-list').children.filter(x=>x.className==='agenda-row');
 assert.equal(agenda.length,meetings.length,'home and calendar must contain the same daily meetings');
 for(let i=0;i<meetings.length;i++){
  assert.ok(agenda[i].children[0].children[0].textContent.startsWith(meetings[i].children[0].textContent));
  assert.equal(agenda[i].style.borderLeftColor,meetings[i].style.borderLeftColor);
 }
 nodes.get('new-appointment').listeners.click();
 nodes.get('appt-note').value='Testbokning';
 nodes.get('appt-person').value='Medarbetare E';
 nodes.get('appt-start').value='15:30';
 nodes.get('appt-end').value='16:00';
 nodes.get('appt-kind').value='Utskolning';
 nodes.get('appt-student').value='Elev J';
 nodes.get('appointment-form').listeners.submit({preventDefault(){}});
 tabs.find(x=>x.dataset.tab==='teamet').listeners.click();
 assert.match(teamStatus('Medarbetare E'),/15:30–16:00 · Utskolning · Elev J/);
 assert.equal(nodes.get('home-meetings').children.length,meetings.length+1);
 const added=nodes.get('agenda-list').children.filter(x=>x.className==='agenda-row');
 assert.equal(added.length,meetings.length+1);
 const custom=added.find(row=>row.children[0].children[1].textContent.includes('Testbokning'));
 custom.children[1].children[1].listeners.click();
 tabs.find(x=>x.dataset.tab==='teamet').listeners.click();
 assert.ok(!teamStatus('Medarbetare E').includes('Elev J'));
 assert.equal(nodes.get('home-meetings').children.length,meetings.length);
 assert.equal(nodes.get('agenda-list').children.filter(x=>x.className==='agenda-row').length,meetings.length);
 console.log('PASS: mobile startup, '+meetings.length+' shared meetings, matching calendar order/colors, pupil link, add/delete updates both views, weather and lunch requests');
}
main().catch(e=>{console.error(e);process.exit(1)});
