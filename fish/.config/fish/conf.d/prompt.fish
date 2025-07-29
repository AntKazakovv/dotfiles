# Optimized Fish Shell Prompt Configuration
# Save to ~/.config/fish/config.fish

# Define colors
set -g fish_color_user cyan
set -g fish_color_host magenta
set -g fish_color_cwd blue
set -g fish_color_git_branch yellow
set -g fish_color_git_dirty red
set -g fish_color_git_clean green
set -g fish_color_time white
set -g fish_color_status_success green
set -g fish_color_status_error red
set -g fish_color_arrow cyan
set -g fish_color_virtualenv purple

# Use Fish's built-in git prompt for better performance
function fish_prompt
    set -l last_status $status
    echo

    # First line: Time, user, host, battery
    set_color $fish_color_time
    printf '[%s]' (date '+%H:%M:%S')
    set_color normal

    set_color $fish_color_user
    printf ' %s' $USER
    set_color normal

    set_color white
    printf '@'
    set_color normal

    set_color $fish_color_host
    printf '%s' (hostname)
    set_color normal

    # Battery (simplified, optional)
    if test -f /sys/class/power_supply/BAT0/capacity
        set -l battery (cat /sys/class/power_supply/BAT0/capacity)
        set_color yellow
        printf ' 🔋%s%%' $battery
        set_color normal
    end

    echo

    # Second line: Working directory and git
    set_color $fish_color_cwd
    printf '📁 %s' (prompt_pwd)
    set_color normal

    set -l git_prompt (__fish_git_prompt)
    if test -n "$git_prompt"
        printf ' %s' "$git_prompt"
    end

    echo

    # Third line: Context info
    set -l has_context 0

    if test -n "$VIRTUAL_ENV"
        set_color $fish_color_virtualenv
        printf '🐍 %s' (basename "$VIRTUAL_ENV")
        set_color normal
        set has_context 1
    end

    if test -f package.json && command -v node >/dev/null
        set -l node_version (string split 'v' (node --version))[2]
        if test -n "$node_version"
            if test $has_context -eq 1
                printf ' '
            end
            set_color green
            printf '⬢ %s' $node_version
            set_color normal
            set has_context 1
        end
    end

    if test -n "$KUBECONFIG" && command -v kubectl >/dev/null
        set -l kctx (kubectl config current-context 2>/dev/null)
        if test -n "$kctx"
            if test $has_context -eq 1
                printf ' '
            end
            set_color blue
            printf '☸ %s' $kctx
            set_color normal
        end
    end

    if test $has_context -eq 1
        echo
    end

    # Final line: Exit status and prompt
    if test $last_status -ne 0
        set_color $fish_color_status_error
        printf '✗ %d ' $last_status
        set_color normal
    end

    set_color $fish_color_arrow
    printf '❯ '
    set_color normal
end

function fish_right_prompt
    if test $CMD_DURATION -gt 5000
        set_color yellow
        printf '%dms' $CMD_DURATION
        set_color normal
    end
end

# Suppress default greeting
set -g fish_greeting ""

# History and completion tuning
set -g fish_history_max 10000
set -g fish_complete_path $fish_complete_path ~/.config/fish/completions

# Aliases
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gd='git diff'
alias gb='git branch'
alias gco='git checkout'
alias glog='git log --oneline --graph --decorate'

# Dev and Docker
alias serve='python -m http.server'
alias myip='curl ipinfo.io/ip'
alias ports='netstat -tuln'

if command -v docker >/dev/null
    alias dps='docker ps'
    alias dpsa='docker ps -a'
    alias di='docker images'
    alias drm='docker rm'
    alias drmi='docker rmi'
end

if command -v kubectl >/dev/null
    alias k='kubectl'
    alias kgp='kubectl get pods'
    alias kgs='kubectl get services'
    alias kgd='kubectl get deployments'
    alias kdp='kubectl describe pod'
    alias kds='kubectl describe service'
end

echo "🐠 Optimized Fish shell configuration loaded!"
