function fish_prompt
    # Сохраняем статус последней команды
    set -l last_status $status

    # Определяем символ для пользователя
    set -l prompt_symbol '❯'
    set -l user_color green
    if fish_is_root_user
        set prompt_symbol '⚡'
        set user_color red
    end

    # Пользователь и хост
    set -l user_host (set_color $user_color --bold)$USER(set_color normal)"@"(set_color blue --bold)(prompt_hostname)(set_color normal)

    # Статус команды
    set -l status_info
    if test $last_status -ne 0
        set status_info (set_color red --bold)"✗ [$last_status]"(set_color normal)" "
    else
        set status_info (set_color green)"✓"(set_color normal)" "
    end

    # Текущая директория с красивым отображением
    set -l pwd_display (set_color cyan --bold)(prompt_pwd --full-length-dirs 2)(set_color normal)

    # Git информация (расширенная)
    set -l git_info
    if git rev-parse --git-dir >/dev/null 2>&1
        set -l branch (git branch --show-current 2>/dev/null)
        if test -z "$branch"
            set branch (git rev-parse --short HEAD 2>/dev/null)
        end
        
        # Проверяем состояние репозитория
        set -l git_status (git status --porcelain 2>/dev/null)
        set -l git_symbol " "
        set -l git_color yellow
        
        if test -n "$git_status"
            set git_symbol "±"
            set git_color yellow --bold
        else
            set git_symbol "✓"
            set git_color green
        end
        
        # Количество изменений
        set -l changes_count (echo "$git_status" | wc -l | string trim)
        if test $changes_count -gt 0
            set git_info " "(set_color magenta)"on "(set_color $git_color)"$git_symbol $branch "(set_color brblack)"[$changes_count]"(set_color normal)
        else
            set git_info " "(set_color magenta)"on "(set_color $git_color)"$git_symbol $branch"(set_color normal)
        end
    end

    # Python виртуальное окружение
    set -l venv_info
    if set -q VIRTUAL_ENV
        set -l venv_name (basename $VIRTUAL_ENV)
        set venv_info " "(set_color brblack)"("(set_color yellow)"🐍 $venv_name"(set_color brblack)")"(set_color normal)
    end

    # Node версия (если есть package.json)
    set -l node_info
    if test -f package.json
        set -l node_version (node --version 2>/dev/null | string replace 'v' '')
        if test -n "$node_version"
            set node_info " "(set_color brblack)"("(set_color green)"⬢ $node_version"(set_color brblack)")"(set_color normal)
        end
    end

    # Собираем промпт
    string join '' -- \n \
        "╭─ " $user_host " " $pwd_display $git_info $venv_info $node_info \n \
        "╰─ " $status_info (set_color $user_color --bold)$prompt_symbol(set_color normal) ' '
end

function fish_right_prompt
    # Показываем время и длительность последней команды
    set -l time_display (set_color brblack)(date '+%H:%M:%S')(set_color normal)
    
    # Длительность последней команды
    set -l duration_info
    if test $CMD_DURATION
        set -l duration_ms $CMD_DURATION
        set -l duration_s (math "$duration_ms / 1000")
        
        if test $duration_s -ge 1
            set -l hours (math -s0 "$duration_s / 3600")
            set -l minutes (math -s0 "$duration_s % 3600 / 60")
            set -l seconds (math -s0 "$duration_s % 60")
            
            if test $hours -gt 0
                set duration_info (printf "%dh %dm %ds" $hours $minutes $seconds)
            else if test $minutes -gt 0
                set duration_info (printf "%dm %ds" $minutes $seconds)
            else
                set duration_info (printf "%ds" $seconds)
            end
            
            set duration_info " "(set_color yellow)"⏱ $duration_info"(set_color normal)" "
        end
    end
    
    echo $duration_info$time_display
end