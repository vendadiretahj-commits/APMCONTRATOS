@echo off
setlocal
cd /d %~dp0

echo ==============================================
echo        APM CONTRATOS v0.4 - Inicializacao
echo ==============================================

where python >nul 2>nul
if errorlevel 1 (
  echo.
  echo Python nao encontrado.
  echo Instale Python 3.11 ou superior e execute este arquivo novamente.
  pause
  exit /b 1
)

echo [1/3] Atualizando dependencias do APM...
python -m pip install -r requirements.txt
if errorlevel 1 (
  echo Falha ao instalar as dependencias Python.
  pause
  exit /b 1
)

echo [2/3] Verificando Tesseract OCR...
where tesseract >nul 2>nul
if errorlevel 1 (
  if exist "C:\Program Files\Tesseract-OCR\tesseract.exe" (
    echo Tesseract encontrado em C:\Program Files\Tesseract-OCR.
  ) else (
    where winget >nul 2>nul
    if not errorlevel 1 (
      echo Tesseract nao encontrado. Tentando instalar automaticamente pelo winget...
      winget install -e --id UB-Mannheim.TesseractOCR --accept-package-agreements --accept-source-agreements --silent
      if errorlevel 1 (
        echo A instalacao automatica nao foi concluida. O APM abrira normalmente.
        echo Voce tambem podera tentar instalar pela tela Configuracoes.
      ) else (
        echo Tesseract instalado.
      )
    ) else (
      echo Winget nao encontrado. O APM abrira sem OCR.
      echo A leitura de PDFs digitais continuara funcionando normalmente.
    )
  )
) else (
  echo Tesseract OCR ja esta instalado.
)

echo [3/3] Iniciando APM Contratos...
start "" http://127.0.0.1:8000
python -m uvicorn backend:app --host 127.0.0.1 --port 8000
pause
