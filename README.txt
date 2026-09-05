APM CONTRATOS — PROTÓTIPO v0.4

NOVIDADES
- Verificação automática do Tesseract OCR na inicialização do Windows.
- Tentativa de instalação automática do Tesseract via winget quando ele não estiver instalado.
- Tela Configurações mostra o status do OCR e possui botão de instalação automática.
- O backend também detecta o Tesseract em C:\Program Files\Tesseract-OCR mesmo antes de o PATH do Windows ser atualizado.
- Documentos processados podem preencher automaticamente vendedor, comprador e imóvel.
- A etapa Documentos da Nova Negociação agora processa os uploads e aplica os campos ao rascunho.
- A tela Leitura IA ganhou botão “Aplicar dados à negociação”.
- Novos campos: nacionalidade, nascimento, cônjuge e regime de bens.
- Matrícula/BCI continuam com metragens independentes e SEM comparação automática.
- DOCX e PDF reais continuam disponíveis pelo servidor local.

WINDOWS — USO RECOMENDADO
1. Extraia todo o ZIP em uma pasta.
2. Dê dois cliques em run_windows.bat.
3. O script instala/atualiza as bibliotecas Python.
4. Se o Tesseract não existir e o Windows possuir winget, o APM tentará instalá-lo automaticamente.
5. O navegador abrirá em http://127.0.0.1:8000

SE O TESSERACT NÃO FOR INSTALADO AUTOMATICAMENTE
- O APM continua funcionando para PDFs que já possuem texto.
- Abra Configurações > OCR para tentar a instalação novamente.
- Em computadores sem winget, será necessária instalação manual do Tesseract.

FLUXO DE DOCUMENTOS
1. Nova Negociação > Documentos.
2. Envie documentos pessoais do vendedor/comprador, Matrícula e BCI/IPTU.
3. O APM processa cada arquivo e aplica os campos localizados ao rascunho.
4. Na etapa Partes/Imóvel, revise e corrija o que for necessário.
5. Informe valor, pagamentos, posse e cláusulas.
6. Gere DOCX/PDF.

IMPORTANTE
- Esta é uma versão de protótipo/homologação.
- A extração automática nunca substitui a conferência humana.
- O sistema não deve concluir sozinho a situação jurídica de gravames.
- Diferenças de metragem entre Matrícula, narrativa e BCI não geram alerta.
- Os documentos processados localmente não são enviados para a internet.
