#!/usr/bin/env bash

# Скрипт для отправки кода в REPL через Zellij
# Читает код из stdin и отправляет в последнюю активную панель

# Читаем весь ввод
CODE=$(cat)

# Удаляем пустые строки (опционально, можно отключить)
if command -v rg &> /dev/null; then
    CODE=$(echo "$CODE" | rg -v '^\s*$')
fi

# Переключаемся в соседнюю панель (вниз), отправляем код и возвращаемся
zellij action move-focus-or-tab down
sleep 0.05  # Небольшая задержка для переключения фокуса

# Отправляем код построчно
while IFS= read -r line; do
    zellij action write-chars "$line"
    zellij action write 13  # Enter (ASCII 13)
    sleep 0.02  # Небольшая задержка между строками
done <<< "$CODE"

# Возвращаемся обратно в редактор
sleep 0.05
zellij action move-focus-or-tab up
