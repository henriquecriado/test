const express = require('express');
const app = express();
app.use(express.json());

let users = [];
let logs = [];
const products = [
  { id: 1, categoria: 'Vitaminas', nome: 'Vitamina C', descricao: 'Suplemento de Vitamina C 500mg', preco: 29.9 },
  { id: 2, categoria: 'Suplementos', nome: 'Whey Protein', descricao: 'Proteína concentrada para recuperação muscular', preco: 99.9 },
  { id: 3, categoria: 'Chás', nome: 'Chá Verde', descricao: 'Chá verde em cápsulas para metabolismo', preco: 39.9 }
];

function calcularIMC(peso, altura) {
  return peso / (altura * altura);
}

function gerarPlano(peso, altura) {
  const imc = calcularIMC(peso, altura);
  let classificacao = '';
  if (imc < 18.5) classificacao = 'Abaixo do peso';
  else if (imc < 25) classificacao = 'Peso normal';
  else if (imc < 30) classificacao = 'Sobrepeso';
  else classificacao = 'Obesidade';

  const litrosAgua = +(peso * 0.033).toFixed(2);
  const dieta = [
    'Café da manhã: Aveia com frutas',
    'Almoço: Salada, arroz integral e peito de frango',
    'Jantar: Sopa de legumes'
  ];
  const dica = 'Não é sobre perfeição, é sobre consistência.';

  return { imc: +imc.toFixed(2), classificacao, litrosAgua, dieta, dica };
}

app.post('/api/onboarding', (req, res) => {
  const { nome, idade, genero, altura, peso, nivelAtividade } = req.body;
  const id = users.length + 1;
  const plano = gerarPlano(peso, altura);
  const user = { id, nome, idade, genero, altura, peso, nivelAtividade, pontos: 0, plano };
  users.push(user);
  res.json(user);
});

app.post('/api/logs', (req, res) => {
  const { userId, peso, agua, atividade } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

  const log = { userId, peso, agua, atividade, data: new Date() };
  logs.push(log);

  user.pontos += 10;
  res.json({ mensagem: 'Log registrado', pontos: user.pontos });
});

app.get('/api/dashboard/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  const userLogs = logs.filter(l => l.userId === userId);
  res.json({ logs: userLogs });
});

app.get('/api/marketplace/produtos', (req, res) => {
  res.json(products);
});

app.post('/api/assistant', (req, res) => {
  const { mensagem } = req.body;
  let resposta = 'Continue firme! Você está indo bem.';
  if (mensagem && mensagem.toLowerCase().includes('doce')) {
    resposta = 'Que tal uma fruta para saciar a vontade de doce?';
  }
  res.json({ resposta });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
