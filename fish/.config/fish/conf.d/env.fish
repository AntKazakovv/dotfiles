set -gx PATH ~/.nix-profile/bin /nix/var/nix/profiles/default/bin $PATH
fish_add_path ~/.local/bin
fish_add_path ~/.cargo/bin
fish_add_path /usr/local/bin
fish_add_path /opt/homebrew/bin/
fish_add_path /Users/remifo/Library/Application Support/pear/bin
set -gx NODE_MODULES_GLOBAL (npm root -g)
