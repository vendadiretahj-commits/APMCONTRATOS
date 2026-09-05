# APM Contratos Web v0.6 — Render Production

Esta versão corrige o carregamento de CSS/JavaScript/assets no Render e executa OCR no servidor.

## Atualização no GitHub
Substitua os arquivos da v0.5 pelos arquivos desta pasta e faça Commit na branch main. O Render deve iniciar um novo deploy automaticamente.

## Render
- Runtime: Docker
- Root Directory: vazio se estes arquivos estiverem na raiz do repositório
- Health check: /api/health (opcional)
- Não é necessário instalar Tesseract no computador dos corretores. O Docker instala Tesseract no servidor.

## Variáveis recomendadas
- APP_SECRET: uma sequência longa e aleatória
- ADMIN_EMAIL: seu e-mail administrativo
- ADMIN_PASSWORD: senha inicial forte
- ADMIN_NAME: nome do administrador
- COOKIE_SECURE: true
- DATABASE_URL: adicionar quando o PostgreSQL estiver configurado

## Teste após o deploy
Abra /api/health. Deve retornar JSON com ok=true, version=0.6 e ocr=true.
Depois abra a raiz do site e confirme que o layout está estilizado e o indicador mostra Online + OCR.
