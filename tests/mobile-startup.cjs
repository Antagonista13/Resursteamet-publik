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
 const document={getElementById:id=>nodes.get(id)||null,createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text}),querySelectorAll:()=>[]};
 const fetches=[];
 const context=vm.createContext({document,window:{scrollTo(){}},sessionStorage:{getItem(){return null},setItem(){}},console,fetch:async url=>{fetches.push(url);return {ok:true,json:async()=>url==='menu.json'?{meals:[]}:{current:{temperature_2m:8}}}}});
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
 assert.equal(nodes.get('staff-summary').children.length,4);
 assert.equal(nodes.get('student-content').children.length,11);
 assert.equal(fetches.length,2);
 assert.equal(nodes.get('weather-temp').textContent,'8°');
 assert.equal(nodes.get('menu-today').textContent,'Ingen aktuell matsedel');
 console.log('PASS: complete mobile startup, '+meetings.length+' meetings (six daily examples plus calendar entries), pupil link, four staff slots, ten pupils, weather and lunch requests');
}
main().catch(e=>{console.error(e);process.exit(1)});
