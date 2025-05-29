fish_add_path (echo $HOME)/.local/share/fnm/
fish_add_path /usr/local/go/bin/
fish_add_path (echo $HOME)/go/bin/

set -x EDITOR hx
## helix-gpt
set -x COPILOT_API_KEY key
set -x HANDLER copilot

eval (fnm env)
