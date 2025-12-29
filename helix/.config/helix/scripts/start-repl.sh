#!/usr/bin/env bash

# Скрипт для запуска REPL в зависимости от типа файла
# Используется для интеграции Helix + Zellij

FILENAME="${1:-}"
EXT="${FILENAME##*.}"

# Определяем REPL на основе расширения файла
case "$EXT" in
    py)
        # Python REPL (попробуем ipython, затем python3)
        if command -v ipython &> /dev/null; then
            exec ipython
        elif command -v python3 &> /dev/null; then
            exec python3
        else
            exec python
        fi
        ;;
    js|mjs)
        # Node.js REPL
        if command -v node &> /dev/null; then
            exec node
        else
            echo "Node.js не установлен"
            exit 1
        fi
        ;;
    ts)
        # TypeScript REPL (ts-node или deno)
        if command -v deno &> /dev/null; then
            exec deno repl
        elif command -v ts-node &> /dev/null; then
            exec ts-node
        else
            echo "Deno или ts-node не установлен"
            exit 1
        fi
        ;;
    rb)
        # Ruby REPL
        if command -v irb &> /dev/null; then
            exec irb
        else
            echo "Ruby IRB не установлен"
            exit 1
        fi
        ;;
    clj)
        # Clojure REPL
        if command -v clj &> /dev/null; then
            exec clj
        else
            echo "Clojure не установлен"
            exit 1
        fi
        ;;
    lua)
        # Lua REPL
        if command -v lua &> /dev/null; then
            exec lua
        else
            echo "Lua не установлен"
            exit 1
        fi
        ;;
    *)
        # По умолчанию используем fish shell
        if command -v fish &> /dev/null; then
            exec fish
        elif command -v bash &> /dev/null; then
            exec bash
        else
            exec sh
        fi
        ;;
esac
