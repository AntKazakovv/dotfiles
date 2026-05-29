# set switch langs
# setxkbmap -layout "us,ru(unipunct)" -option "grp:alt_shift_toggle,lv3:ralt_switch,grp_led:scroll"
# 
alias jt=just
alias bat=batcat
alias yz=yazi
alias sc=scooter
alias ls=eza

function eza_tree
    eza --tree --level=2 --icons -I node_modules
end

function go_engine
    cd ~/Projects/src/wlc-engine
end

function go_devcasino
    cd ~/Projects/src/wlc_devcasino
end
