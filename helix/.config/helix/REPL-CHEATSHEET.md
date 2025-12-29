# REPL в Helix — Шпаргалка

## Быстрый старт

```bash
zellij                    # Запусти Zellij
hx script.py              # Открой файл
Ctrl-a r                  # Создай REPL
Ctrl-Space                # Отправь код
```

---

## Клавиатурные комбинации

### Навигация
```
Ctrl-h  →  Фокус влево
Ctrl-j  →  Фокус вниз
Ctrl-k  →  Фокус вверх
Ctrl-l  →  Фокус вправо
```

### REPL
```
Ctrl-a r      →  Создать REPL-панель
Ctrl-Space    →  Отправить строку/выделение
Ctrl-Esc      →  Отправить без пустых строк
```

### Zellij
```
Ctrl-g        →  Блокировка/разблокировка клавиш
Ctrl-p x      →  Закрыть текущую панель
Ctrl-p f      →  Полноэкранный режим панели
```

---

## Поддерживаемые языки

| Расширение | REPL |
|------------|------|
| `.py` | IPython / Python3 |
| `.js`, `.mjs` | Node.js |
| `.ts` | Deno / ts-node |
| `.rb` | IRB |
| `.clj` | Clojure |
| `.lua` | Lua |
| другие | Fish / Bash |

---

## Типичные workflow

### Python
```python
# 1. Открой файл
hx analysis.py

# 2. Создай REPL (Ctrl-a r)

# 3. Импорты (выдели + Ctrl-Space)
import pandas as pd

# 4. Тестируй функции
df = pd.DataFrame({'A': [1, 2, 3]})
```

### JavaScript
```javascript
// Открой: hx app.js
// REPL: Ctrl-a r
// Тест: выдели код + Ctrl-Space

const x = [1, 2, 3];
console.log(x.map(n => n * 2));
```

---

## Решение проблем

### REPL не запускается
```bash
chmod +x ~/.config/helix/scripts/start-repl.sh
which python3  # проверь интерпретатор
```

### Код не отправляется
```bash
chmod +x ~/.config/helix/scripts/send-to-repl.sh
which zellij
```

### Python: ошибки с отступами
→ Используй `Ctrl-Esc` вместо `Ctrl-Space`

---

## Полезные команды Helix

```
:sh <cmd>                 →  Выполнить shell команду
:pipe-to <cmd>            →  Отправить выделение в команду
:reflow                   →  Переформатировать текст
:write                    →  Сохранить (или Alt-s)
```

---

## Файлы конфигурации

```
~/.config/helix/config.toml              # Основная конфигурация
~/.config/helix/scripts/start-repl.sh    # Запуск REPL
~/.config/helix/scripts/send-to-repl.sh  # Отправка кода
~/.config/zellij/config.kdl              # Конфигурация Zellij
~/.config/zellij/plugins/                # Плагины Zellij
```

---

**Полная документация**: `~/.config/helix/REPL.md`
