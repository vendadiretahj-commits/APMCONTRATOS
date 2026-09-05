# APM Contratos Web v0.5

Esta versão foi preparada para hospedagem online. Corretores acessam pelo navegador em qualquer dispositivo; OCR, geração DOCX/PDF e banco rodam no servidor.

## Recursos desta versão
- Login com sessão HTTP-only.
- Usuário administrador inicial criado por variáveis de ambiente.
- Negociações salvas em banco central (SQLite em desenvolvimento ou PostgreSQL em produção).
- Leitura de PDF/imagem com Tesseract instalado dentro do container Docker.
- Geração DOCX/PDF no servidor.
- Frontend responsivo reaproveitado do protótipo v0.4.
- Dockerfile e configuração `render.yaml` para implantação.

## Teste local com Docker
1. Instale Docker Desktop.
2. Na pasta do projeto execute: `docker compose up --build`
3. Abra `http://localhost:8000`
4. Login padrão do compose: `admin@apm.local` / `123456`

## Publicação no Render
1. Crie um repositório Git privado e envie esta pasta.
2. No Render, escolha Blueprint e selecione o `render.yaml`.
3. Defina `ADMIN_PASSWORD` no painel do Render.
4. Após o deploy, acesse a URL HTTPS criada pelo Render.

## Produção
Antes de uso com documentos reais:
- trocar senha administrativa;
- configurar domínio próprio;
- revisar política LGPD e retenção;
- configurar armazenamento de arquivos em serviço privado persistente (S3/R2) na próxima versão;
- ativar backups do PostgreSQL.
