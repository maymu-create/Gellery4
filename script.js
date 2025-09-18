// Helper
const $ = id => document.getElementById(id);
const saveToLS = (k,v) => localStorage.setItem('notebook:'+k, JSON.stringify(v));
const loadFromLS = k => { try { return JSON.parse(localStorage.getItem('notebook:'+k)) } catch(e){return null} }

// ==================== Page Switching ====================
const mainPage = $('mainPage');
const summaryPage = $('summaryPage');
$('goSummary').onclick = () => {
  mainPage.style.display = 'none';
  summaryPage.style.display = 'block';
  renderSummary();
};
$('backMain').onclick = () => {
  summaryPage.style.display = 'none';
  mainPage.style.display = 'block';
};

// ==================== Notes ====================
let notes = loadFromLS('notes') || [];
let currentNoteIndex = null;

function renderNotesList() {
  const list = $('notesList');
  list.innerHTML = '';
  notes.forEach((n,i)=>{
    const div = document.createElement('div');
    div.textContent = n.title || `โน้ต ${i+1}`;
    div.style.cursor='pointer';
    div.onclick = () => {
      currentNoteIndex = i;
      $('noteText').value = n.content;
    };
    list.appendChild(div);
  });
}

// สร้างโน้ตใหม่
$('newNoteBtn').onclick = () => {
  notes.push({title:`โน้ต ${notes.length+1}`, content:''});
  currentNoteIndex = notes.length-1;
  $('noteText').value = '';
  saveToLS('notes', notes);
  renderNotesList();
}

// บันทึกโน้ต
$('saveNoteBtn').onclick = () => {
  if(currentNoteIndex===null) return alert('เลือกโน้ตก่อนบันทึก');
  notes[currentNoteIndex].content = $('noteText').value;
  saveToLS('notes', notes);
  renderNotesList();
}

renderNotesList();

// ==================== To-Do List ====================
let todos = loadFromLS('todos') || [];
const todosEl = $('todos'), todoInput = $('todoInput');

function renderTodos() {
  todosEl.innerHTML='';
  todos.forEach((t,i)=>{
    const div=document.createElement('div');
    div.className='todo-item'+(t.done?' completed':'');
    const cb=document.createElement('input');
    cb.type='checkbox'; cb.checked=t.done;
    cb.onchange=()=>{
      todos[i].done=cb.checked; saveToLS('todos',todos); renderTodos();
    };
    const text=document.createElement('div'); text.className='text'; text.textContent=t.text;
    const edit=document.createElement('button'); edit.textContent='✎'; edit.className='btn ghost';
    edit.onclick=()=>{ const v=prompt('แก้ไข',t.text); if(v){todos[i].text=v; saveToLS('todos',todos); renderTodos();}};
    const del=document.createElement('button'); del.textContent='🗑'; del.className='btn ghost';
    del.onclick=()=>{ if(confirm('ลบ?')){todos.splice(i,1); saveToLS('todos',todos); renderTodos();}};
    div.append(cb,text,edit,del);
    todosEl.appendChild(div);
  });
}

function addTodo(text){ todos.unshift({text,done:false,created:Date.now()}); saveToLS('todos',todos); renderTodos(); }

$('addTodo').onclick = ()=>{ if(todoInput.value.trim()){ addTodo(todoInput.value.trim()); todoInput.value=''; }}
todoInput.addEventListener('keypress', e=>{ if(e.key==='Enter' && todoInput.value.trim()){ addTodo(todoInput.value.trim()); todoInput.value=''; }})
renderTodos();

// ==================== Calculator ====================
const calcScreen = $('calcScreen');
let calcExp = '', mem = loadFromLS('calc_mem')||0;

function updateScreen(){ calcScreen.textContent = calcExp || '0'; }

document.querySelectorAll('#calcButtons button').forEach(b=>{
  b.onclick = ()=>{
    const v = b.dataset.val, op = b.dataset.op;
    if(v!==undefined){ calcExp+=v; updateScreen(); return; }
    if(op!==undefined){ calcExp+=op; updateScreen(); return; }
    if(b.id==='equals'){ try{ calcExp=String(Function('return '+calcExp)()); updateScreen(); }catch(e){alert('สูตรไม่ถูกต้อง')} }
    if(b.id==='clear'){ calcExp=''; updateScreen(); }
    if(b.id==='back'){ calcExp=calcExp.slice(0,-1); updateScreen(); }
    if(b.id==='memSave'){ mem=parseFloat(calcExp||0); saveToLS('calc_mem',mem); alert('MS: '+mem); }
    if(b.id==='memRecall'){ calcExp+=String(mem); updateScreen(); }
  }
});
updateScreen();

// ==================== Accounting ====================
let accounts = loadFromLS('accounts') || [];
const tbody = document.querySelector('#accountTable tbody');

$('addRow').onclick = ()=>{
  const desc=$('desc').value.trim(), income=parseFloat($('income').value)||0, expense=parseFloat($('expense').value)||0;
  if(!desc) return alert('กรุณาใส่คำอธิบาย');
  accounts.push({date:Date.now(),desc,income:income?income.toFixed(2):'',expense:expense?expense.toFixed(2):''});
  $('desc').value=$('income').value=$('expense').value='';
  saveToLS('accounts',accounts);
  renderAccounts();
}

function renderAccounts(){
  tbody.innerHTML=''; let balance=0;
  accounts.forEach((r,i)=>{
    balance += (+r.income||0)-(+r.expense||0);
    const tr=document.createElement('tr');
    tr.innerHTML = `<td>${new Date(r.date).toLocaleDateString()}</td>
                    <td>${r.desc}</td>
                    <td>${r.income}</td>
                    <td>${r.expense}</td>
                    <td>${balance.toFixed(2)}</td>
                    <td><button data-i="${i}" class="btn ghost">ลบ</button></td>`;
    tbody.appendChild(tr);
  });
  $('totalAmount').textContent = balance.toFixed(2);
  $('netBalance').textContent = balance.toFixed(2);
  saveToLS('accounts',accounts);
}

tbody.onclick = e => { if(e.target.matches('button')){ accounts.splice(+e.target.dataset.i,1); saveToLS('accounts',accounts); renderAccounts(); } }
renderAccounts();

// ==================== Summary Page ====================
const summaryTable = summaryPage.querySelector('tbody');
function renderSummary(){
  summaryTable.innerHTML='';
  let balance=0;
  accounts.forEach(r=>{
    balance += (+r.income||0)-(+r.expense||0);
    const tr=document.createElement('tr');
    tr.innerHTML = `<td>${new Date(r.date).toLocaleDateString()}</td>
                    <td>${r.desc}</td>
                    <td>${r.income}</td>
                    <td>${r.expense}</td>
                    <td>${balance.toFixed(2)}</td>`;
    summaryTable.appendChild(tr);
  });
}

// ==================== Export ====================
function toCSV(rows){ return rows.map(r=>r.map(c=>`"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n'); }

$('exportCSV').onclick = ()=>{
  const rows=[['Date','Description','Income','Expense']].concat(accounts.map(r=>[new Date(r.date).toLocaleString(),r.desc,r.income,r.expense]));
  const blob=new Blob([toCSV(rows)],{type:'text/csv'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='accounts.csv'; a.click();
}

$('exportAll').onclick = ()=>{
  const allNotes=notes.map(n=>n.content).join('\n\n');
  const rows=[['Notes'],[allNotes],[],['Todos','Done','Text']].concat(todos.map(t=>[t.done?'YES':'NO',t.text]));
  const blob=new Blob([toCSV(rows)],{type:'text/csv'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='notebook_export.csv'; a.click();
}

// ==================== Clear ====================
$('clearAll').onclick = ()=>{ if(confirm('ล้างทั้งหมด?')){ localStorage.clear(); location.reload(); } }
$('clearAccounts').onclick = ()=>{ if(confirm('ล้างบัญชี?')){ accounts=[]; renderAccounts(); saveToLS('accounts',accounts); } }
