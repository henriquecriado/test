let currentUser = null;

const onboardingForm = document.getElementById('onboarding-form');
const planoDiv = document.getElementById('plano');
const logsSection = document.getElementById('logs');
const logForm = document.getElementById('log-form');
const dashboardSection = document.getElementById('dashboard');
const verDashboardBtn = document.getElementById('ver-dashboard');
const listaLogs = document.getElementById('lista-logs');
const marketplaceSection = document.getElementById('marketplace');
const carregarProdutosBtn = document.getElementById('carregar-produtos');
const produtosUl = document.getElementById('produtos');
const assistantSection = document.getElementById('assistant');
const chatForm = document.getElementById('chat-form');
const mensagensDiv = document.getElementById('mensagens');

onboardingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = {
    nome: document.getElementById('nome').value,
    idade: Number(document.getElementById('idade').value),
    genero: document.getElementById('genero').value,
    altura: Number(document.getElementById('altura').value),
    peso: Number(document.getElementById('peso').value),
    nivelAtividade: document.getElementById('nivel').value
  };

  const res = await fetch('/api/onboarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  currentUser = await res.json();
  planoDiv.innerHTML = `IMC: ${currentUser.plano.imc} (${currentUser.plano.classificacao})<br>Água: ${currentUser.plano.litrosAgua} L/dia<br>Dica: ${currentUser.plano.dica}`;
  logsSection.classList.remove('hidden');
  dashboardSection.classList.remove('hidden');
  marketplaceSection.classList.remove('hidden');
  assistantSection.classList.remove('hidden');
});

logForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) return;
  const log = {
    userId: currentUser.id,
    peso: Number(document.getElementById('peso-log').value),
    agua: Number(document.getElementById('agua-log').value),
    atividade: document.getElementById('atividade-log').value
  };
  await fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(log)
  });
  alert('Log registrado');
  logForm.reset();
});

verDashboardBtn.addEventListener('click', async () => {
  if (!currentUser) return;
  const res = await fetch(`/api/dashboard/${currentUser.id}`);
  const data = await res.json();
  listaLogs.innerHTML = '';
  data.logs.forEach(l => {
    const li = document.createElement('li');
    li.textContent = `${new Date(l.data).toLocaleString()}: peso ${l.peso}kg, água ${l.agua}L, atividade ${l.atividade}`;
    listaLogs.appendChild(li);
  });
});

carregarProdutosBtn.addEventListener('click', async () => {
  const res = await fetch('/api/marketplace/produtos');
  const data = await res.json();
  produtosUl.innerHTML = '';
  data.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.nome} - R$${p.preco}`;
    produtosUl.appendChild(li);
  });
});

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensagem = document.getElementById('mensagem').value;
  const res = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensagem })
  });
  const data = await res.json();
  const msgUser = document.createElement('div');
  msgUser.textContent = `Você: ${mensagem}`;
  const msgBot = document.createElement('div');
  msgBot.textContent = `Bot: ${data.resposta}`;
  mensagensDiv.appendChild(msgUser);
  mensagensDiv.appendChild(msgBot);
  chatForm.reset();
});
