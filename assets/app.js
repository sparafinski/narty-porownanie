const state={sort:"total",org:"all",month:"all",travel:"bus",eur:4.30,chf:4.60};
const fmt=n=>Math.round(n).toLocaleString("pl-PL");
const vis=r=>r.dates.filter(d=>state.month==="all"||d[3]===state.month);
function calc(r){
  const ds=vis(r); if(!ds.length) return null;
  const base=Math.min(...ds.map(d=>d[2]));
  const rate=r.cur==="CHF"?state.chf:state.eur;
  const travel=state.travel==="bus"?r.busAdd:-r.ownCut;
  const total=base+r.ins+r.fees*rate+travel;
  return {base,total,perkm:total/r.km};
}
function bar(r){
  const w=Math.min(r.km/310,1)*100, cols=["var(--green)","var(--blue)","var(--red)"];
  const m=r.kmMix||r.mix;
  if(!m) return `<div class="bar" role="img" aria-label="${r.km} km tras"><i style="width:${w}%;background:var(--neutral)"></i></div>`;
  const s=m.reduce((a,b)=>a+b,0);
  return `<div class="bar" role="img" aria-label="${r.km} km tras"><span style="display:flex;width:${w}%">${m.map((x,i)=>`<i style="width:${x/s*100}%;background:${cols[i]}"></i>`).join("")}</span></div>`;
}
function travelNote(r){
  if(state.travel==="bus") return r.busAdd?`autokar +${r.busAdd} zł (${r.busTime})`:`autokar w cenie (${r.busTime})`;
  if(r.org==="ftf") return "dojazd własny w cenie bazowej";
  return r.ownCut?`dojazd własny −${r.ownCut} zł`:"brak zniżki za dojazd własny";
}
function render(){
  const rows=R.filter(r=>state.org==="all"||r.org===state.org).map(r=>({r,c:calc(r)})).filter(x=>x.c);
  const key={total:x=>x.c.total,base:x=>x.c.base,km:x=>-x.r.km,perkm:x=>x.c.perkm}[state.sort];
  rows.sort((a,b)=>key(a)-key(b));
  const el=document.getElementById("list");
  document.getElementById("count").textContent=rows.length?`${rows.length} ${rows.length===1?"ośrodek":rows.length<5?"ośrodki":"ośrodków"} pasuje do filtrów`:"";
  if(!rows.length){el.innerHTML='<p class="empty">Żadna oferta nie pasuje do tych filtrów. Wybierz inny miesiąc lub organizatora.</p>';return;}
  el.innerHTML=rows.map(({r,c})=>`<article class="row ${r.org}">
    <div>
      <div class="org">${r.org==="ss"?"SnowShow":"Feel The Flow"}</div>
      <h3 class="name">${r.name}</h3>
      <div class="country">${r.country}</div>
      <div class="dates">${r.dates.map(d=>`<a class="date${state.month!=="all"&&d[3]!==state.month?" hidden":""}" href="${d[1]}" target="_blank" rel="noopener">${d[0]} <b>${fmt(d[2])} zł</b></a>`).join("")}</div>
    </div>
    <div>
      <div class="trail-top"><span><strong>${r.km} km</strong> tras, skipass ${r.days||6} dni</span><span>${r.alt}</span></div>
      ${bar(r)}
      <ul class="facts">
        <li><strong>Nocleg:</strong> ${r.stay}</li>
        <li><strong>Opłaty na miejscu:</strong> ok. ${String(r.fees).replace(".",",")} ${r.cur==="CHF"?"CHF":"€"}${r.hb?" (z wyżywieniem)":""}</li>
        <li><strong>Transport:</strong> ${travelNote(r)}</li>
      </ul>
    </div>
    <div class="cost">
      <div class="total">${fmt(c.total)} <small>zł</small></div>
      <div class="base">od ${fmt(c.base)} zł + dodatki</div>
      <span class="perkm">${fmt(c.perkm)} zł za km tras</span>
      ${r.approx?'<span class="approx">opłaty szacunkowe</span>':""}
    </div>
    <details><summary>Plusy i minusy</summary>
      <div class="notes">
        <div class="plus"><h3>Plusy</h3><ul>${r.plus.map(p=>`<li>${p}</li>`).join("")}</ul></div>
        <div class="minus"><h3>Minusy</h3><ul>${r.minus.map(p=>`<li>${p}</li>`).join("")}</ul></div>
      </div>
    </details>
  </article>`).join("");
}
document.getElementById("sort").addEventListener("change",e=>{state.sort=e.target.value;render();});
["org","month","travel"].forEach(id=>document.querySelectorAll(`#${id} button`).forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(`#${id} button`).forEach(x=>x.setAttribute("aria-pressed","false"));
  b.setAttribute("aria-pressed","true");state[id]=b.dataset.v;render();
})));
["eur","chf"].forEach(k=>document.getElementById(k).addEventListener("input",e=>{const v=parseFloat(e.target.value);if(v>0){state[k]=v;render();}}));
render();
