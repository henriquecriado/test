# VitaBalance API

Protótipo de backend em Node.js/Express para a plataforma de saúde e bem-estar.

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   node server.js
   ```

O servidor será iniciado na porta `3000`.

## Endpoints principais

- `POST /api/onboarding` — recebe dados do usuário e gera plano personalizado.
- `POST /api/logs` — registra peso, água e atividade física.
- `GET /api/dashboard/:userId` — retorna logs do usuário.
- `GET /api/marketplace/produtos` — lista produtos do marketplace.
- `POST /api/assistant` — chatbot simples com dicas de motivação.

Todos os retornos são em **PT-BR**.
