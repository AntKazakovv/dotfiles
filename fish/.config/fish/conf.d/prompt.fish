# Advanced Fish Shell Prompt Configuration
# Save this to ~/.config/fish/config.fish

# Color definitions for consistent theming
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

# Function to get Git branch information
function git_branch_name
    set -l branch (git symbolic-ref --short HEAD 2>/dev/null)
    if test -n "$branch"
        echo $branch
    else
        set -l commit (git rev-parse --short HEAD 2>/dev/null)
        if test -n "$commit"
            echo "detached:$commit"
        end
    end
end

# Function to check Git status
function git_status_info
    if git rev-parse --git-dir >/dev/null 2>&1
        set -l status_output (git status --porcelain 2>/dev/null)
        set -l ahead_behind (git rev-list --left-right --count HEAD...@{upstream} 2>/dev/null)
        
        set -l clean_status ""
        set -l dirty_status ""
        set -l sync_status ""
        
        # Check for changes
        if test -n "$status_output"
            set dirty_status "●"
        else
            set clean_status "●"
        end
        
        # Check for ahead/behind status
        if test -n "$ahead_behind"
            set -l ahead (echo $ahead_behind | cut -f1)
            set -l behind (echo $ahead_behind | cut -f2)
            
            if test $ahead -gt 0
                set sync_status "$sync_status↑$ahead"
            end
            if test $behind -gt 0
                set sync_status "$sync_status↓$behind"
            end
        end
        
        echo "$clean_status$dirty_status$sync_status"
    end
end

# Function to get current time
function current_time
    date '+%H:%M:%S'
end

# Function to get Python virtual environment
function get_virtualenv
    if test -n "$VIRTUAL_ENV"
        basename "$VIRTUAL_ENV"
    end
end

# Function to get Node.js version if package.json exists
function get_node_version
    if test -f package.json
        set -l node_version (node --version 2>/dev/null | string replace 'v' '')
        if test -n "$node_version"
            echo "⬢ $node_version"
        end
    end
end

# Function to get current Kubernetes context
function get_k8s_context
    if command -v kubectl >/dev/null 2>&1
        set -l context (kubectl config current-context 2>/dev/null)
        if test -n "$context"
            echo "☸ $context"
        end
    end
end

# Function to get battery status (for laptops)
function get_battery_status
    if test -f /sys/class/power_supply/BAT0/capacity
        set -l battery (cat /sys/class/power_supply/BAT0/capacity)
        set -l status (cat /sys/class/power_supply/BAT0/status)
        
        if test "$status" = "Charging"
            echo "🔌 $battery%"
        else if test $battery -le 20
            echo "🪫 $battery%"
        else if test $battery -le 50
            echo "🔋 $battery%"
        else
            echo "🔋 $battery%"
        end
    end
end

# Main prompt function
function fish_prompt
    set -l last_status $status
    
    # Start building the prompt
    echo
    
    # First line: Time, User, Host, and Battery
    set_color $fish_color_time
    printf '[%s]' (current_time)
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
    
    # Battery status (if available)
    set -l battery (get_battery_status)
    if test -n "$battery"
        set_color yellow
        printf ' %s' $battery
        set_color normal
    end
    
    echo
    
    # Second line: Current directory
    set_color $fish_color_cwd
    printf '📁 %s' (prompt_pwd)
    set_color normal
    
    # Git information
    set -l git_branch (git_branch_name)
    if test -n "$git_branch"
        set_color white
        printf ' on '
        set_color normal
        
        set_color $fish_color_git_branch
        printf ' %s' $git_branch
        set_color normal
        
        set -l git_status (git_status_info)
        if test -n "$git_status"
            if string match -q "*●*" $git_status
                if git diff --quiet 2>/dev/null
                    set_color $fish_color_git_clean
                else
                    set_color $fish_color_git_dirty
                end
            else
                set_color $fish_color_git_clean
            end
            printf ' %s' $git_status
            set_color normal
        end
    end
    
    echo
    
    # Third line: Additional context (virtualenv, node, k8s)
    set -l has_context 0
    
    # Python virtual environment
    set -l venv (get_virtualenv)
    if test -n "$venv"
        set_color $fish_color_virtualenv
        printf '🐍 %s' $venv
        set_color normal
        set has_context 1
    end
    
    # Node.js version
    set -l node_info (get_node_version)
    if test -n "$node_info"
        if test $has_context -eq 1
            printf ' '
        end
        set_color green
        printf '%s' $node_info
        set_color normal
        set has_context 1
    end
    
    # Kubernetes context
    set -l k8s_context (get_k8s_context)
    if test -n "$k8s_context"
        if test $has_context -eq 1
            printf ' '
        end
        set_color blue
        printf '%s' $k8s_context
        set_color normal
        set has_context 1
    end
    
    if test $has_context -eq 1
        echo
    end
    
    # Final line: Status and prompt arrow
    if test $last_status -ne 0
        set_color $fish_color_status_error
        printf '✗ %d' $last_status
        set_color normal
        printf ' '
    end
    
    set_color $fish_color_arrow
    printf '❯ '
    set_color normal
end

# Right prompt for additional information
function fish_right_prompt
    # Show execution time for long-running commands
    if test $CMD_DURATION
        if test $CMD_DURATION -gt 5000
            set_color yellow
            printf '%dms' $CMD_DURATION
            set_color normal
        end
    end
end

# Enhanced fish shell configuration
set -g fish_greeting ""  # Remove default greeting

# Enable vi key bindings (optional)
# fish_vi_key_bindings

# History configuration
set -g fish_history_max 10000

# Completion configuration
set -g fish_complete_path $fish_complete_path ~/.config/fish/completions

# Custom aliases for enhanced productivity
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

# Development aliases
alias serve='python -m http.server'
alias myip='curl ipinfo.io/ip'
alias ports='netstat -tuln'

# Docker aliases (if Docker is available)
if command -v docker >/dev/null 2>&1
    alias dps='docker ps'
    alias dpsa='docker ps -a'
    alias di='docker images'
    alias drm='docker rm'
    alias drmi='docker rmi'
end

# Kubernetes aliases (if kubectl is available)
if command -v kubectl >/dev/null 2>&1
    alias k='kubectl'
    alias kgp='kubectl get pods'
    alias kgs='kubectl get services'
    alias kgd='kubectl get deployments'
    alias kdp='kubectl describe pod'
    alias kds='kubectl describe service'
end

echo "🐠 Advanced Fish shell configuration loaded successfully!"
