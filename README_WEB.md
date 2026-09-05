# APM Contratos Web v0.8 — Render Production

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
Abra /api/health. Deve retornar JSON com ok=true, version=0.8 e ocr=true.
Depois abra a raiz do site e confirme que o layout está estilizado e o indicador mostra Online + OCR.

## v0.8 - leitura documental ampliada
- CNH/RG/CIN em PDF passam por OCR visual mesmo quando o PDF contém somente texto do QR/certificado.
- CNHs digitais SENATRAN usam recortes da área do documento e leitura da zona MRZ como apoio.
- Matrículas escaneadas podem ser lidas em todas as páginas, com extração de matrícula, CNM, cartório, descrição registral, endereço, unidade, condomínio, inscrição, áreas e atos registrais.
- O sistema sugere o titular mais recente aparente pela sequência dos atos, mas exige conferência humana.
- Metragens da matrícula e do BCI continuam sem comparação automática.
