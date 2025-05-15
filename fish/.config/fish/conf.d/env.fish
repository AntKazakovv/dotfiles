fish_add_path (echo $HOME)/.local/share/fnm/
fish_add_path /usr/local/go/bin/
fish_add_path (echo $HOME)/go/bin/

set -x EDITOR hx

eval (fnm env)
