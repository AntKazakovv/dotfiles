#!/usr/bin/env fish

# Скрипт для конвертации стандартного времени в метрическое
# Использование: ./metric_time.fish 12:30:45

function metric_time
    # Проверка аргументов
    if test (count $argv) -eq 0
        echo "Использование: metric_time hh:mm:ss"
        echo "Пример: metric_time 12:30:45"
        return 1
    end

    set time_input $argv[1]

    # Проверка формата ввода
    if not string match -qr '^\d{1,2}:\d{2}:\d{2}$' $time_input
        echo "Ошибка: неверный формат времени. Используйте hh:mm:ss"
        return 1
    end

    # Разбор времени
    set parts (string split ':' $time_input)
    set hours $parts[1]
    set minutes $parts[2]
    set seconds $parts[3]

    # Проверка диапазонов
    if test $hours -gt 23 -o $minutes -gt 59 -o $seconds -gt 59
        echo "Ошибка: неверное значение времени"
        return 1
    end

    # Вычисление общего количества секунд с начала дня
    set total_seconds (math "$hours * 3600 + $minutes * 60 + $seconds")

    # Вычисление прогресса дня (0-1)
    # День = 86400 секунд
    set day_progress (math "$total_seconds / 86400")

    # Вычисление метрического времени
    # 1 день = 10 метрических часов
    set metric_hours_decimal (math "$day_progress * 10")
    set metric_hours (math -s0 "floor($metric_hours_decimal)")

    # Оставшаяся часть после часов * 100 = метрические минуты
    set remaining_after_hours (math "$metric_hours_decimal - $metric_hours")
    set metric_minutes_decimal (math "$remaining_after_hours * 100")
    set metric_minutes (math -s0 "floor($metric_minutes_decimal)")

    # Оставшаяся часть после минут * 100 = метрические секунды
    set remaining_after_minutes (math "$metric_minutes_decimal - $metric_minutes")
    set metric_seconds (math -s0 "floor($remaining_after_minutes * 100)")

    # Форматирование вывода с ведущими нулями
    printf "%d:%02d:%02d\n" $metric_hours $metric_minutes $metric_seconds
end
