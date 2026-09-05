#!/bin/sh
cd "$(dirname "$0")"
python3 -m pip install -r requirements.txt
( sleep 2; python3 -m webbrowser http://127.0.0.1:8000 ) >/dev/null 2>&1 &
python3 -m uvicorn backend:app --host 127.0.0.1 --port 8000
