# REPL-Driven Development в Helix + Zellij

Интерактивная среда для разработки с поддержкой отправки кода в REPL прямо из редактора.

## Оглавление

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Быстрый старт](#быстрый-старт)
4. [Клавиатурные комбинации](#клавиатурные-комбинации)
5. [Поддерживаемые языки](#поддерживаемые-языки)
6. [Примеры использования](#примеры-использования)
7. [Настройка](#настройка)
8. [Устранение проблем](#устранение-проблем)

---

## Введение

Данная конфигурация позволяет работать в стиле REPL-driven development, отправляя код из Helix в интерактивный интерпретатор, запущенный в отдельной панели Zellij.

### Преимущества

- **Мгновенная обратная связь** — тестируй код без переключения контекста
- **Итеративная разработка** — экспериментируй с кодом в реальном времени
- **Отладка** — быстро проверяй гипотезы и значения переменных
- **Обучение** — изучай новые библиотеки и API интерактивно

---

## Архитектура

```
┌─────────────────────────────────────┐
│         Zellij Session              │
│  ┌──────────────┬─────────────────┐ │
│  │              │                 │ │
│  │   Helix      │   REPL Panel    │ │
│  │   Editor     │   (Python/JS/   │ │
│  │              │    Ruby/etc)    │ │
│  │              │                 │ │
│  └──────────────┴─────────────────┘ │
│                                     │
│  Plugin: zellij-autolock            │
│  (автоматическая блокировка         │
│   клавиш при работе в Helix)        │
└─────────────────────────────────────┘
```

### Компоненты

1. **Helix** — редактор кода с настроенными клавиатурными комбинациями
2. **Zellij** — терминальный мультиплексер для управления панелями
3. **zellij-autolock** — плагин для предотвращения конфликтов клавиш
4. **start-repl.sh** — скрипт для запуска подходящего REPL
5. **send-to-repl.sh** — скрипт для отправки кода в REPL

---

## Быстрый старт

### 1. Запуск среды

```bash
# Запусти Zellij
zellij

# Открой файл в Helix
hx script.py
```

### 2. Создание REPL-панели

Нажми `Ctrl-a`, затем `r` — появится панель снизу с запущенным REPL для текущего языка.

### 3. Отправка кода

Выдели код (или встань на строку) и нажми `Ctrl-Space` — код выполнится в REPL.

### 4. Навигация

Используй `Ctrl-h/j/k/l` для переключения между панелями.

---

## Клавиатурные комбинации

### Навигация между панелями

| Комбинация | Действие |
|------------|----------|
| `Ctrl-h` | Переместить фокус влево |
| `Ctrl-j` | Переместить фокус вниз |
| `Ctrl-k` | Переместить фокус вверх |
| `Ctrl-l` | Переместить фокус вправо |

### Управление REPL

| Комбинация | Действие |
|------------|----------|
| `Ctrl-a` → `r` | Создать новую REPL-панель снизу |
| `Ctrl-Space` | Отправить текущую строку/выделение в REPL |
| `Ctrl-Esc` | Отправить код без пустых строк (полезно для Python) |

### Примечания

- **Автоматическая блокировка**: Когда фокус на Helix, Zellij автоматически блокирует свои клавиши
- **Переключение режимов**: Нажми `Ctrl-g` в Zellij для ручной блокировки/разблокировки

---

## Поддерживаемые языки

REPL автоматически определяется по расширению файла:

| Язык | Расширение | REPL | Требования |
|------|------------|------|------------|
| Python | `.py` | `ipython` или `python3` | `ipython` (опционально) |
| JavaScript | `.js`, `.mjs` | `node` | Node.js |
| TypeScript | `.ts` | `deno repl` или `ts-node` | Deno или ts-node |
| Ruby | `.rb` | `irb` | Ruby |
| Clojure | `.clj` | `clj` | Clojure |
| Lua | `.lua` | `lua` | Lua |
| Другие | `*` | `fish` или `bash` | Fish shell (опционально) |

### Настройка приоритета REPL

Отредактируй `~/.config/helix/scripts/start-repl.sh` для изменения предпочитаемого REPL:

```bash
py)
    # Например, всегда использовать python3 вместо ipython
    exec python3
    ;;
```

---

## Примеры использования

### Python: Интерактивная разработка

```python
# 1. Открой файл
# hx data_analysis.py

# 2. Создай REPL: Ctrl-a r

# 3. Импортируй библиотеки (выдели и Ctrl-Space)
import pandas as pd
import numpy as np

# 4. Тестируй функции построчно
df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})
print(df.head())

# 5. Итеративно разрабатывай функции
def process_data(df):
    return df * 2

result = process_data(df)
print(result)
```

### JavaScript: Быстрое прототипирование

```javascript
// 1. Открой файл: hx app.js
// 2. Создай REPL: Ctrl-a r

// 3. Тестируй функции
const greet = (name) => `Hello, ${name}!`;
console.log(greet('World'));

// 4. Проверяй API
const data = { id: 1, name: 'Test' };
JSON.stringify(data);
```

### TypeScript с Deno

```typescript
// 1. Открой файл: hx script.ts
// 2. REPL запустится с Deno

interface User {
  id: number;
  name: string;
}

const user: User = { id: 1, name: "Alice" };
console.log(user);
```

### Работа с пустыми строками (Python)

```python
# Используй Ctrl-Esc для отправки без пустых строк
# Это полезно для блоков кода с отступами

def calculate(x: int) -> int:
    result = x * 2

    return result

# Выдели всю функцию и нажми Ctrl-Esc
# Пустые строки будут удалены автоматически
```

---

## Настройка

### Изменение расположения REPL-панели

По умолчанию REPL открывается снизу. Для изменения отредактируй `~/.config/helix/config.toml`:

```toml
# Открывать справа
C-a = { r = ":sh zellij action new-pane -d right -- ~/.config/helix/scripts/start-repl.sh %{buffer_name}" }

# Открывать слева
C-a = { r = ":sh zellij action new-pane -d left -- ~/.config/helix/scripts/start-repl.sh %{buffer_name}" }
```

### Добавление нового языка

Отредактируй `~/.config/helix/scripts/start-repl.sh`:

```bash
go)
    # Go REPL через gore
    if command -v gore &> /dev/null; then
        exec gore
    else
        echo "gore не установлен"
        exit 1
    fi
    ;;
```

### Настройка задержек отправки

Если код отправляется слишком быстро, увеличь задержки в `send-to-repl.sh`:

```bash
# Увеличить задержку между строками
sleep 0.05  # было 0.02

# Увеличить задержку переключения фокуса
sleep 0.1   # было 0.05
```

### Кастомизация фильтрации пустых строк

По умолчанию `Ctrl-Esc` удаляет пустые строки через `ripgrep`. Для изменения фильтра:

```toml
# Удалять только строки с пробелами
C-esc = ":pipe-to sed '/^[[:space:]]*$/d' | ~/.config/helix/scripts/send-to-repl.sh"

# Удалять комментарии Python
C-esc = ":pipe-to rg -v '^\\s*(#|$)' | ~/.config/helix/scripts/send-to-repl.sh"
```

---

## Устранение проблем

### REPL не запускается

**Проблема**: При нажатии `Ctrl-a r` ничего не происходит.

**Решение**:
```bash
# Проверь, что скрипт исполняемый
chmod +x ~/.config/helix/scripts/start-repl.sh

# Проверь, что интерпретатор установлен
which python3  # для Python
which node     # для JavaScript
```

### Код не отправляется в REPL

**Проблема**: При нажатии `Ctrl-Space` код не появляется в REPL.

**Решение**:
```bash
# Проверь права на скрипт отправки
chmod +x ~/.config/helix/scripts/send-to-repl.sh

# Проверь, что zellij доступен
which zellij

# Убедись, что фокус переключается корректно
# Попробуй вручную: Ctrl-j для перехода в REPL
```

### Конфликты клавиш

**Проблема**: `Ctrl-h/j/k/l` не работают или ведут себя странно.

**Решение**:
```bash
# Убедись, что zellij-autolock загружен
# Перезапусти Zellij и проверь логи

# Временно переключи Zellij в locked режим: Ctrl-g
# Теперь все клавиши должны работать в Helix
```

### Python код с отступами не выполняется

**Проблема**: Многострочный код Python с пустыми строками вызывает ошибки.

**Решение**:
- Используй `Ctrl-Esc` вместо `Ctrl-Space` для автоматического удаления пустых строк
- Или вручную убери пустые строки перед отправкой

### REPL открывается не на том языке

**Проблема**: Для `.py` файла открывается bash вместо Python.

**Решение**:
```bash
# Проверь расширение файла
# Убедись, что файл сохранён с правильным расширением

# Проверь скрипт start-repl.sh
cat ~/.config/helix/scripts/start-repl.sh | grep -A 5 "py)"
```

### Множественные REPL-панели

**Проблема**: Случайно создано несколько REPL-панелей.

**Решение**:
```bash
# Закрой лишние панели в Zellij
# Переключись в режим Pane: Ctrl-p
# Закрой текущую панель: x
```

---

## Дополнительные возможности

### Сохранение истории REPL

Для Python с IPython история сохраняется автоматически в `~/.ipython/profile_default/history.sqlite`.

Для других REPL настрой сохранение истории в соответствующих конфигах:
- Node.js: `~/.node_repl_history`
- IRB (Ruby): `~/.irb_history`

### Интеграция с DevEnv

Если используешь DevEnv для управления окружением проекта, создай `devenv.nix`:

```nix
{ pkgs, ... }:

{
  packages = [ pkgs.python3 pkgs.ipython ];

  scripts.repl.exec = ''
    ipython
  '';
}
```

Затем запускай REPL через DevEnv:
```bash
devenv shell
# В Helix: Ctrl-a r запустит ipython из DevEnv окружения
```

### Расширенная отправка кода

Создай дополнительные команды в `config.toml`:

```toml
# Отправка всего файла
C-a = { f = ":sh cat %{buffer_name} | ~/.config/helix/scripts/send-to-repl.sh" }

# Отправка функции под курсором (требует tree-sitter)
C-a = { F = ":select-textobject function inner | :pipe-to ~/.config/helix/scripts/send-to-repl.sh" }
```

---

## Полезные ссылки

- [Helix Editor Documentation](https://docs.helix-editor.com/)
- [Zellij Documentation](https://zellij.dev/documentation/)
- [zellij-autolock Plugin](https://github.com/fresh2dev/zellij-autolock)
- [Оригинальная статья](https://int8.tech/posts/repl-programming-helix-zellij-devenv/)

---

## Лицензия

Эта конфигурация основана на работе [Clement POIRET](https://int8.tech/) и адаптирована для личного использования.

---

**Версия документации**: 1.0
**Дата**: 2025-12-29
**Автор конфигурации**: Anton Kazakov
