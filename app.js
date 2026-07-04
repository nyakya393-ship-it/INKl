const KEY = "inklog_battles";

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  initRegister();
  renderHistory();
  renderAnalysis();
});

/* REGISTER */
function initRegister(){
  const form = document.getElementById("battleForm");
  if(!form) return;

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const date = document.getElementById("battleDate");
  if(date) date.value = now.toISOString().slice(0,16);

  form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const data = {
      id:Date.now(),
      date:val("battleDate"),
      type:val("battleType"),
      rule:val("rule"),
      stage:val("stage"),
      weapon:val("weapon"),
      rank:val("rank"),
      result:val("result"),
      kill:num("kill"),
      assist:num("assist"),
      death:num("death"),
      special:num("special"),
      paint:num("paint"),
      memo:val("memo")
    };

    const list = get();
    list.push(data);
    save(list);

    form.reset();
    alert("保存完了");
  });
}

/* HISTORY */
function renderHistory(){
  const el = document.getElementById("list");
  if(!el) return;

  const data = get();

  if(data.length === 0){
    el.innerHTML = "<div class='card'>データなし</div>";
    return;
  }

  el.innerHTML = data.map(b=>`
    <div class="card">
      <div>${emoji(b.result)} ${b.date}</div>
      <div>${b.stage} / ${b.weapon}</div>

      <button class="btn-detail" onclick="detail(${b.id})">詳細</button>
      <button class="btn-delete" onclick="removeBattle(${b.id})">削除</button>
    </div>
  `).join("");
}

/* ANALYSIS */
function renderAnalysis(){
  const el = document.getElementById("analysis");
  if(!el) return;

  const d = get();
  const win = d.filter(x=>x.result==="win").length;

  const winRate = d.length ? (win/d.length*100).toFixed(1) : 0;

  const avgKill = avg(d,"kill");
  const avgDeath = avg(d,"death");
  const kd = avgDeath ? (avgKill/avgDeath).toFixed(2) : avgKill;

  el.innerHTML = `
    <div class="card">
      <h3>戦績</h3>
      <p>試合数:${d.length}</p>
      <p>勝率:${winRate}%</p>
      <p>K/D:${kd}</p>
    </div>
  `;
}

/* ACTION */
function removeBattle(id){
  if(!confirm("削除する？")) return;
  save(get().filter(x=>x.id!==id));
  renderHistory();
  renderAnalysis();
}

function detail(id){
  const b = get().find(x=>x.id===id);
  alert(JSON.stringify(b,null,2));
}

/* STORAGE */
function get(){
  return JSON.parse(localStorage.getItem(KEY))||[];
}

function save(d){
  localStorage.setItem(KEY,JSON.stringify(d));
}

/* HELPERS */
function val(id){return document.getElementById(id)?.value||"";}
function num(id){return Number(document.getElementById(id)?.value||0);}
function avg(a,k){
  if(!a.length) return 0;
  return (a.reduce((s,x)=>s+(x[k]||0),0)/a.length).toFixed(1);
}
function emoji(r){
  return r==="win"?"🏆":r==="lose"?"💀":"📡";
}
