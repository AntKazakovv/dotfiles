function fish_prompt
    # Сохраняем статус последней команды
    set -l last_status $status

    # Определяем символ для пользователя (root или обычный)
    set -l prompt_symbol '➜'
    if fish_is_root_user
        set prompt_symbol '#'
    end

    # Статус команды (показываем только если не 0)
    set -l status_color
    if test $last_status -ne 0
        set status_color (set_color red)"[$last_status] "(set_color normal)
    end

    # Текущая директория с укорочением
    set -l pwd_display (set_color cyan)(prompt_pwd --full-length-dirs 2)(set_color normal)

    # Git информация (если находимся в git репозитории)
    set -l git_info (fish_vcs_prompt)
    if test -n "$git_info"
        set git_info " "(set_color yellow)"$git_info"(set_color normal)
    end

    # Собираем промпт
    string join '' -- \n $pwd_display $git_info \n $status_color (set_color green)$prompt_symbol(set_color normal) ' '
end

function fish_right_prompt
    # Показываем время в правом промпте
    set -l time_display (set_color brblack)(date '+%H:%M:%S')(set_color normal)
    echo $time_display
end
