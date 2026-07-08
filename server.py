#!/usr/bin/env python3
"""Локальный сервер для НейроЗеркала.
Запуск:  python3 server.py   →   откройте http://localhost:4599
"""
import http.server
import socketserver
import functools
import os

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
PORT = 4599

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIRECTORY)
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"НейроЗеркало: http://localhost:{PORT}  (Ctrl+C — остановить)")
    httpd.serve_forever()
