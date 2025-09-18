// Helper
const $ = id => document.getElementById(id);
const saveToLS = (k,v)=>localStorage.setItem(k,JSON.stringify(v));
const loadFromLS = k=>JSON.parse(localStorage.getItem(k)||'null');

// ================= Notes =================
let notes = loadFromLS('notes') || [];
let currentNoteIndex = null;

function renderNotesList() {
  const list = $('notesList');
  list.innerHTML = '';
  notes.forEach((n,i)=>{
    const div = document.createElement('div');
    div.textContent = n.title || `โน้ต ${i+1}`;
    div.className = 'note-item';
    div.onclick = ()=>{
      currentNoteIndex = i;
      $('noteText').value = n.content;
    };
    list.appendChild(div);
  });
}
$('newNoteBtn').onclick=()=>{
  notes.push({title:`โน้ต ${notes.length+1}`, content:''});
  currentNoteIndex=notes.length-1;
  $('noteText').value='';
  saveToLS('notes',notes);
  renderNotesList();
};
$('saveNoteBtn').onclick=()=>{
  if(currentNoteIndex===null) return alert('เลือกโน้ตก่อน');
  notes[currentNoteIndex].content=$('noteText').value;
  saveToLS('notes',notes);
  renderNotesList();
};
renderNotesList();

// ================= To-Do =================
let todos = loadFromLS('todos') || [];
function renderTodos(){
  const list=$('todoList'); list.innerHTML='';
  todos.forEach((t,i)=>{
    const li=document.createElement('li');
    li.textContent=t;
    const btn=document.createElement('button');
    btn.textContent='ลบ';
    btn.onclick=()=>{todos.splice(i,1); saveToLS('todos',todos); renderTodos();};
    li.appendChild(btn);
    list.appendChild(li);
  });
}
$('addTodoBtn').onclick=()=>{
  const val=$('todoInput').value.trim();
  if(val){todos.push(val); saveToLS('todos',todos); $('todoInput').value=''; renderTodos();}
};
renderTodos();

// ================= Summary Page =================
const mainPage=$('mainPage'), summaryPage=$('summaryPage');
$('goSummary').onclick=()=>{ mainPage.style.display='none'; summaryPage.style.display='block'; renderSummary(); };
$('backMain').onclick=()=>{ summaryPage.style.display='none'; mainPage.style.display='block'; };

function renderSummary(){
  let accounts = loadFromLS('accounts')||[
    {date:Date.now(), desc:'เริ่มต้น', income:1000, expense:0}
  ];
  const tbody=$('summaryTable').querySelector('tbody'); tbody.innerHTML='';
  let balance=0;
  accounts.forEach(r=>{
    balance+=(+r.income||0)-(+r.expense||0);
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${new Date(r.date).toLocaleDateString()}</td>
                  <td>${r.desc}</td>
                  <td>${r.income}</td>
                  <td>${r.expense}</td>
                  <td>${balance.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  });
}

// ================= Calculator Modal =================
const calcModal=$('calcModal'), openCalc=$('openCalc'), closeCalc=calcModal.querySelector('.close');
openCalc.onclick=()=>{ calcModal.style.display='block'; }
closeCalc.onclick=()=>{ calcModal.style.display='none'; }
window.onclick=(e)=>{ if(e.target===calcModal) calcModal.style.display='none'; }

let calcExp='', calcScreen=$('calcScreen');
function updateScreen(){ calcScreen.textContent=calcExp||'0'; }
document.querySelectorAll('#calcButtons button').forEach(b=>{
  b.onclick=()=>{
    const v=b.dataset.val, op=b.dataset.op;
    if(v!==undefined){calcExp+=v;updateScreen();return;}
    if(op!==undefined){calcExp+=op;updateScreen();return;}
    if(b.id==='equals'){ try{calcExp=String(Function('return '+calcExp)());}catch(e){alert('สูตรไม่ถูกต้อง');calcExp='';} updateScreen(); }
    if(b.id==='clear'){calcExp='';updateScreen();}
  };
});
updateScreen();